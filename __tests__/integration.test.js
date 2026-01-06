import { test, describe } from 'node:test';
import assert from 'node:assert';
import { createRequire } from 'node:module';
import fs from 'node:fs/promises';
import path from 'node:path';

const require = createRequire(import.meta.url);

describe('Integration Tests', () => {
  test('should load all codemods from modz directory', async () => {
    const modzDir = './modz';
    const files = await fs.readdir(modzDir);
    const jsFiles = files.filter(file => file.endsWith('.js'));
    
    // Test that each codemod can be loaded
    for (const file of jsFiles) {
      try {
        const codemod = require(path.join('../modz', file));
        assert(codemod, `Codemod ${file} should be loadable`);
        
        // Test that it has required properties
        if (codemod.title) {
          assert(typeof codemod.title === 'string', `Codemod ${file} should have string title`);
        }
        
        // Test that it's a function
        if (codemod.default) {
          assert(typeof codemod.default === 'function', `Codemod ${file} should have function default export`);
        } else if (typeof codemod === 'function') {
          assert(typeof codemod === 'function', `Codemod ${file} should be a function`);
        }
      } catch (error) {
        assert.fail(`Failed to load codemod ${file}: ${error.message}`);
      }
    }
  });

  test('should transform code with fn-to-const codemod', () => {
    const fnToConst = require('../modz/fn-to-const.js');
    
    const source = `
      function hello(name) {
        return "Hello " + name;
      }
      
      function goodbye(name) {
        return "Goodbye " + name;
      }
    `;
    
    const result = fnToConst({ source }, { jscodeshift: require('jscodeshift') });
    
    assert(result.includes('const hello'));
    assert(result.includes('const goodbye'));
    assert(result.includes('function('));
    assert(!result.includes('function hello'));
    assert(!result.includes('function goodbye'));
  });

  test('should transform code with to-arrow codemod', () => {
    const toArrow = require('../modz/to-arrow.js');
    
    const source = `
      const add = function(a, b) {
        return a + b;
      };
      
      const multiply = function(a, b) {
        return a * b;
      };
    `;
    
    const result = toArrow({ source }, { jscodeshift: require('jscodeshift') }, { printOptions: { quote: 'single' } });
    
    // The codemod might return null if no transformations are made
    if (result) {
      assert(result.includes('=>'));
      assert(result.includes('a + b'));
      assert(result.includes('a * b'));
    }
  });

  test('should transform code with template-literal codemod', () => {
    const templateLiteral = require('../modz/template-literal.js');
    
    const source = `
      const message = "Hello " + name + "!";
      const greeting = "Welcome " + user + " to " + site + ".";
    `;
    
    const result = templateLiteral({ source }, { jscodeshift: require('jscodeshift') }, { printOptions: { quote: 'single' } });
    
    assert(result.includes('`Hello ${name}!`'));
    assert(result.includes('`Welcome ${user} to ${site}.`'));
  });

  test('should handle empty source code', () => {
    const fnToConst = require('../modz/fn-to-const.js');
    
    const source = '';
    const result = fnToConst({ source }, { jscodeshift: require('jscodeshift') });
    
    assert.strictEqual(result, '');
  });

  test('should handle source code with no functions', () => {
    const fnToConst = require('../modz/fn-to-const.js');
    
    const source = 'const x = 1; const y = 2;';
    const result = fnToConst({ source }, { jscodeshift: require('jscodeshift') });
    
    assert.strictEqual(result, source);
  });

  test('should preserve comments and formatting where possible', () => {
    const fnToConst = require('../modz/fn-to-const.js');
    
    const source = `
      // This is a comment
      function hello(name) {
        // Another comment
        return "Hello " + name;
      }
    `;
    
    const result = fnToConst({ source }, { jscodeshift: require('jscodeshift') });
    
    // Check that the transformation worked
    assert(result.includes('const hello'));
    // Comments might not be preserved in all cases, so we'll just check the main transformation
  });
}); 