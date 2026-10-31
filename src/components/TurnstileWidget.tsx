import { forwardRef, useEffect, useImperativeHandle, useRef, useState } from "react";
import { TURNSTILE_ACTION, TURNSTILE_SCRIPT_SRC, TURNSTILE_SITE_KEY } from "@/lib/turnstile";

export type TurnstileHandle = {
  /** Tokens are single-use, so the widget must be reset after every attempt. */
  reset: () => void;
};

interface TurnstileApi {
  render: (container: HTMLElement, options: Record<string, unknown>) => string;
  reset: (widgetId?: string) => void;
  remove: (widgetId?: string) => void;
}

/** Kept off `window`'s global type to avoid polluting the app's declarations. */
const api = () => (window as unknown as { turnstile?: TurnstileApi }).turnstile;

let scriptLoader: Promise<void> | null = null;

/** Inject the Turnstile script once, on first use — never on page load. */
function loadScript(): Promise<void> {
  if (api()) return Promise.resolve();
  scriptLoader ??= new Promise<void>((resolve, reject) => {
    const el = document.createElement("script");
    el.src = TURNSTILE_SCRIPT_SRC;
    el.async = true;
    el.defer = true;
    el.onload = () => resolve();
    el.onerror = () => {
      scriptLoader = null; // let a later mount retry
      reject(new Error("Turnstile script failed to load"));
    };
    document.head.appendChild(el);
  });
  return scriptLoader;
}

/**
 * Renders the Turnstile widget and injects the hidden `cf-turnstile-response`
 * input inside itself, so the surrounding `<form>` picks the token up through
 * `FormData` with no extra plumbing.
 */
export const TurnstileWidget = forwardRef<TurnstileHandle, { className?: string }>(
  function TurnstileWidget({ className }, ref) {
    const container = useRef<HTMLDivElement>(null);
    const widgetId = useRef<string | null>(null);
    // Turnstile reports failures asynchronously, so a widget that never
    // materialised (e.g. an unregistered domain) must not be removed later.
    const broken = useRef(false);
    const [failed, setFailed] = useState(false);
    // Incremented on every render() call; 0 means "nothing rendered yet".
    const attempt = useRef(0);
    const [renderKey, setRenderKey] = useState(0);

    useImperativeHandle(ref, () => ({
      reset: () => {
        const id = widgetId.current;
        // A token is single-use, so re-render a fresh widget instead of
        // resetting the current one.
        if (id === null || broken.current) return;
        try {
          api()?.remove(id);
        } catch {
          /* the widget is already gone */
        }
        widgetId.current = null;
        setRenderKey((key) => key + 1);
      },
    }));

    useEffect(() => {
      let cancelled = false;
      const thisAttempt = attempt.current + 1;

      loadScript()
        .then(() => {
          const turnstile = api();
          if (cancelled || !turnstile || !container.current || widgetId.current !== null) return;
          attempt.current = thisAttempt;
          widgetId.current = turnstile.render(container.current, {
            sitekey: TURNSTILE_SITE_KEY,
            action: TURNSTILE_ACTION,
            "error-callback": () => {
              // Ignore callbacks from a superseded widget (a reset() replaced
              // it, or StrictMode discarded the first render pass).
              if (attempt.current !== thisAttempt) return;
              broken.current = true;
              setFailed(true);
            },
          });
        })
        .catch(() => {
          broken.current = true;
          if (!cancelled) setFailed(true);
        });

      return () => {
        cancelled = true;
        const id = widgetId.current;
        widgetId.current = null;
        if (id === null || broken.current) return;
        try {
          api()?.remove(id);
        } catch {
          /* the widget is already gone */
        }
      };
    }, [renderKey]);

    if (failed) {
      return (
        <p className="text-sm text-red-400">
          Human verification could not load. Please reload the page.
        </p>
      );
    }
    return <div ref={container} className={className} />;
  },
);
