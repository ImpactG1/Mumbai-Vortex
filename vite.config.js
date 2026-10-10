import { defineConfig } from 'vite';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default defineConfig({
  resolve: {
    alias: {
      '@voxel-mumbai/core': path.resolve(__dirname, 'packages/core/src'),
      '@voxel-mumbai/web': path.resolve(__dirname, 'packages/web/src'),
      '@assets': path.resolve(__dirname, 'assets')
    }
  },
  worker: {
    format: 'es'
  },
  server: {
    port: 3000,
    open: false
  }
});
