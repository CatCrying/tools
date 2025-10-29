import { createFilter } from "vite";
import JavaScriptObfuscator from "javascript-obfuscator";
function javascriptObfuscator(options = {}) {
  const { include = ["**/*.js"], exclude = [], ...obfuscatorOptions } = options;
  const filter = createFilter(include, exclude);
  return {
    name: "vite-plugin-javascript-obfuscator",
    apply: "build",
    enforce: "post",
    renderChunk(code, chunk) {
      if (!filter(chunk.fileName)) {
        return null;
      }
      console.log(`[vite-plugin-javascript-obfuscator] Obfuscating chunk: ${chunk.fileName}`);
      const obfuscationResult = JavaScriptObfuscator.obfuscate(code, {
        ...obfuscatorOptions,
        sourceMap: true
      });
      return {
        code: obfuscationResult.getObfuscatedCode(),
        map: obfuscationResult.getSourceMap()
      };
    }
  };
}
export {
  javascriptObfuscator as default
};
//# sourceMappingURL=index.mjs.map
