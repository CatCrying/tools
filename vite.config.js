import { defineConfig } from 'vite';

export default defineConfig({
  define: {
    // This injects the build timestamp into our JavaScript
    __BUILD_TIMESTAMP__: JSON.stringify(new Date().toISOString()),
  },
});
