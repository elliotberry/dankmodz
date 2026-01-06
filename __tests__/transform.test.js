import { test, describe } from 'node:test';
import assert from 'node:assert';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
const transform = require('../lib/transform.js');

describe('Transform Module', () => {
  test('should transform valid JavaScript code', () => {
    const source = 'function hello() { return "world"; }';
    const mockTransform = (file, api) => {
      const j = api.jscodeshift;
      const root = j(file.source);
      root.find(j.FunctionDeclaration).forEach(path => {
        const funcName = path.node.id.name;
        const funcParams = path.node.params;
        const funcBody = path.node.body;
        
        const newFunc = j.variableDeclaration('const', [
          j.variableDeclarator(
            j.identifier(funcName),
            j.functionExpression(null, funcParams, funcBody)
          )
        ]);
        
        j(path).replaceWith(newFunc);
      });
      return root.toSource();
    };

    const result = transform(source, mockTransform);
    assert(result.includes('const hello'));
    assert(result.includes('function('));
  });

  test('should return original source when transform returns null', () => {
    const source = 'const x = 1;';
    const mockTransform = () => null;
    
    const result = transform(source, mockTransform);
    assert.strictEqual(result, source);
  });

  test('should return original source when transform returns undefined', () => {
    const source = 'const x = 1;';
    const mockTransform = () => undefined;
    
    const result = transform(source, mockTransform);
    assert.strictEqual(result, source);
  });

  test('should handle transform errors gracefully', () => {
    const source = 'const x = 1;';
    const mockTransform = () => {
      throw new Error('Transform failed');
    };
    
    const result = transform(source, mockTransform);
    assert.strictEqual(result, source);
  });

  test('should provide correct API to transform function', () => {
    let receivedApi = null;
    const mockTransform = (file, api) => {
      receivedApi = api;
      return file.source;
    };
    
    transform('test', mockTransform);
    
    assert(receivedApi.j);
    assert(receivedApi.jscodeshift);
    assert(typeof receivedApi.stats === 'function');
  });
}); 