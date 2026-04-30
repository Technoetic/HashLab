import { defineConfig } from 'vite';
import { visualizer } from 'rollup-plugin-visualizer';

export default defineConfig({
  base: './',
  build: {
    target: 'es2020',
    sourcemap: true,
    rollupOptions: {
      plugins: [
        visualizer({ filename: 'step_archive/bundle-report.html', gzipSize: true, brotliSize: true }),
      ],
    },
  },
  server: { port: 5173, host: '127.0.0.1' },
});
