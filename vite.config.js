import { defineConfig } from 'vite';
import javascriptObfuscator from './plugins/obfuscator.js';


export default defineConfig({
  build: {
    sourcemap: false,
  },
    plugins: [
    javascriptObfuscator({
      include: ["**/*.js"],
      options: {


        
      }
    }),
  ],
  define: {
    // This injects the build timestamp into our JavaScript
    __BUILD_TIMESTAMP__: JSON.stringify(new Date().toISOString()),
  },
});
