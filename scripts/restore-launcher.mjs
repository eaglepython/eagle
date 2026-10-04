import { readFile, writeFile } from 'node:fs/promises';

// The public root is the launcher; the tracker itself is served at /app.html.
const launcher = await readFile(new URL('../public/launcher.html', import.meta.url), 'utf8');
await writeFile(new URL('../docs/index.html', import.meta.url), launcher.replace(/[ \t]+$/gm, ''));
