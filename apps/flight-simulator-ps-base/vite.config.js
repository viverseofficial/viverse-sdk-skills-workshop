import fs from 'node:fs';
import path from 'node:path';
import { defineConfig } from 'vite';

// Inline plugin: copies PS SDK service worker + KTX2 basis transcoder to dist root
// after every production build (required by @polygon-streaming/web-player-threejs)
function psAssets() {
  return {
    name: 'ps-sdk-assets',
    writeBundle({ dir }) {
      const outDir = dir || 'dist';
      // service-worker.js must be at the web root
      fs.copyFileSync(
        'node_modules/@polygon-streaming/web-player-threejs/dist/service-worker.js',
        path.join(outDir, 'service-worker.js')
      );
      // KTX2 basis transcoder files must be at /lib/
      fs.mkdirSync(path.join(outDir, 'lib'), { recursive: true });
      for (const f of ['basis_transcoder.js', 'basis_transcoder.wasm']) {
        fs.copyFileSync(
          `node_modules/three/examples/jsm/libs/basis/${f}`,
          path.join(outDir, 'lib', f)
        );
      }
    }
  };
}

export default defineConfig({
  plugins: [psAssets()],
  server: {
    port: 3000,
  },
  build: {
    target: 'esnext',
    chunkSizeWarningLimit: 1500,
  },
});
