const fs = require('node:fs');
const ts = require('typescript');
const path = require('node:path');
const cache = new Map();
module.exports = function load(file) {
  const resolved = path.resolve(file);
  if (cache.has(resolved)) return cache.get(resolved).exports;
  const mod = { exports: {} }; cache.set(resolved, mod);
  const compiled = ts.transpileModule(fs.readFileSync(resolved, 'utf8'), { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 } });
  new Function('module', 'exports', 'require', compiled.outputText)(mod, mod.exports, name => name.startsWith('.') ? load(path.resolve(path.dirname(resolved), name + '.ts')) : require(name));
  return mod.exports;
};
