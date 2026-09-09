import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { realpathSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

// Canonicalizar el directorio evita diferencias de rutas en carpetas vinculadas
// (por ejemplo, Documentos de OneDrive en Windows).
const projectRoot = realpathSync(fileURLToPath(new URL('.', import.meta.url)));
process.chdir(projectRoot);

export default defineConfig({
  root: projectRoot,
  plugins: [react()],
});
