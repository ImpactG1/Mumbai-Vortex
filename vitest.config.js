import { defineConfig } from 'vitest/config';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default defineConfig({
  test: {
    globals: true,
    environment: 'node'
  },
  resolve: {
    alias: {
      '@voxel-mumbai/core': path.resolve(__dirname, 'packages/core/src'),
      '@voxel-mumbai/web': path.resolve(__dirname, 'packages/web/src')
    }
  }
});
