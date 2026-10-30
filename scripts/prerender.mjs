/**
 * Prerenders the SPA into dist/index.html so crawlers and link unfurlers see
 * real markup (headings, content) instead of an empty #root div.
 *
 * Runs after `vite build`; the client still hydrates normally at runtime.
 */
import fs from 'node:fs/promises';
import { createServer } from 'vite';

const TEMPLATE = 'dist/index.html';
const ROOT = '<div id="root"></div>';

const vite = await createServer({
  server: { middlewareMode: true },
  appType: 'custom',
  logLevel: 'error',
});

try {
  const [{ renderToString }, React, { default: App }] = await Promise.all([
    import('react-dom/server'),
    import('react'),
    vite.ssrLoadModule('/src/App.tsx'),
  ]);

  const html = renderToString(React.createElement(App));
  const template = await fs.readFile(TEMPLATE, 'utf8');

  if (!template.includes(ROOT)) {
    throw new Error(`Prerender anchor ${ROOT} not found in ${TEMPLATE}`);
  }
  if (!html.includes('<h1')) {
    throw new Error('Prerendered markup has no <h1>; refusing to write.');
  }

  await fs.writeFile(TEMPLATE, template.replace(ROOT, `<div id="root">${html}</div>`));
  console.log(`prerendered ${html.length} bytes into ${TEMPLATE}`);
} finally {
  await vite.close();
}
