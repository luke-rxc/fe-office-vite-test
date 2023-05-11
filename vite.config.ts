import { defineConfig, splitVendorChunkPlugin } from 'vite';
import { resolve } from 'path';
import react from '@vitejs/plugin-react';
import git from 'git-rev-sync';
import { NodeGlobalsPolyfillPlugin } from '@esbuild-plugins/node-globals-polyfill';

// https://vitejs.dev/config/
export default defineConfig({
  build: {
    outDir: 'build',
    chunkSizeWarningLimit: 2500,
  },
  define: {
    'import.meta.env.VITE_DATADOG_VERSION': JSON.stringify(git.short()),
  },
  resolve: {
    alias: {
      '@contexts': resolve(__dirname, 'src/contexts'),
      '@components': resolve(__dirname, 'src/components'),
      '@assets': resolve(__dirname, 'src/assets'),
      '@apis': resolve(__dirname, 'src/apis'),
      '@constants': resolve(__dirname, 'src/constants'),
      '@features': resolve(__dirname, 'src/features'),
      '@hocs': resolve(__dirname, 'src/hocs'),
      '@hooks': resolve(__dirname, 'src/hooks'),
      '@libs': resolve(__dirname, 'src/libs'),
      '@models': resolve(__dirname, 'src/models'),
      '@services': resolve(__dirname, 'src/services'),
      '@styles': resolve(__dirname, 'src/styles'),
      '@utils': resolve(__dirname, 'src/utils'),
      '@config': resolve(__dirname, 'src/config'),
    },
  },
  envDir: 'environments',
  plugins: [
    process.env.MODE !== 'production'
      ? react({
          jsxRuntime: 'classic',
        })
      : react(),
    splitVendorChunkPlugin(),
  ],
  optimizeDeps: {
    esbuildOptions: {
      // Node.js global to browser globalThis
      define: {
        global: 'globalThis',
      },
      // Enable esbuild polyfill plugins
      plugins: [
        NodeGlobalsPolyfillPlugin({
          buffer: true,
        }),
      ],
    },
  },
});
