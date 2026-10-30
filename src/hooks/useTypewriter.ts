import { useEffect, useState } from 'react';

export const roles = [
  'Headless Full-Stack Developer',
  'WordPress Plugin Architect',
  'AI Agent & MCP Engineer',
  'WooCommerce Specialist',
];

const ROTATE_MS = 3200;

/**
 * Cycles through `roles` on a timer. A per-character typewriter reflowed the
 * hero headline on every keystroke (40–80 ms), which dominated main-thread
 * layout work; rotating whole phrases keeps layout stable.
 */
export function useTypewriter() {
  const [roleIndex, setRoleIndex] = useState(0);

  useEffect(() => {
    const id = setInterval(() => setRoleIndex((prev) => (prev + 1) % roles.length), ROTATE_MS);
    return () => clearInterval(id);
  }, []);

  return roles[roleIndex];
}
