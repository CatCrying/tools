import { defineConfig } from 'vite';
import javascriptObfuscator from './plugins/obfuscator.js';


export default defineConfig({
  build: {
    sourcemap: false,
  },
    plugins: [
    // In your vite.config.js plugins array

javascriptObfuscator({
  include: ["**/*.js"],
  options: {
    compact: true,
    controlFlowFlattening: true,
    controlFlowFlatteningThreshold: 1,
    deadCodeInjection: true,
    deadCodeInjectionThreshold: 1,
    debugProtection: true, // Enabled for aggressive anti-debugging
    debugProtectionInterval: 0, // Runs continuously
    disableConsoleOutput: true,
    identifierNamesGenerator: 'mangled', // Hardest to read
    ignoreImports: true,
    log: false,
    numbersToExpressions: true, // Makes numbers harder to read
    renameGlobals: false, // Still recommended to keep false
    selfDefending: true, // Makes the code resistant to formatting/beautifying
    simplify: true,
    splitStrings: true, // Splits strings into smaller parts
    splitStringsChunkLength: 5,
    stringArray: true,
    stringArrayEncoding: ['rc4'], // RC4 is stronger than base64
    stringArrayThreshold: 1,
    transformObjectKeys: true,
    unicodeEscapeSequence: false,
  }
}),
  ],
  define: {
    // This injects the build timestamp into our JavaScript
    __BUILD_TIMESTAMP__: JSON.stringify(new Date().toISOString()),
  },
});
