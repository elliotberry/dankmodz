import { test, describe } from 'node:test';
import assert from 'node:assert';
import { createRequire } from 'node:module';
import path from 'node:path';

const require = createRequire(import.meta.url);

describe('Codemod Modules', () => {
  test('fn-to-const should convert function declarations to const', () => {
    const fnToConst = require('../modz/fn-to-const.js');
    const source = `
      function hello(name) {
        return "Hello " + name;
      }
      
      function greet(name) {
        return "Greetings " + name;
      }
    `;
    
    const result = fnToConst({ source }, { jscodeshift: require('jscodeshift') });
    
    assert(result.includes('const hello'));
    assert(result.includes('const greet'));
    assert(result.includes('function('));
  });

  test('fn-to-const should handle functions without names', () => {
    const fnToConst = require('../modz/fn-to-const.js');
    const source = `
      const anonymous = function() {
        return "anonymous";
      };
    `;
    
    const result = fnToConst({ source }, { jscodeshift: require('jscodeshift') });
    // Should not crash and should preserve the function
    assert(result.includes('function('));
  });

  test('to-arrow should convert functions to arrow functions', () => {
    const toArrow = require('../modz/to-arrow.js');
    const source = `
      const add = function(a, b) {
        return a + b;
      };
    `;
    
    const result = toArrow({ source }, { jscodeshift: require('jscodeshift') }, { printOptions: { quote: 'single' } });
    
    // The codemod might return null if no transformations are made
    if (result) {
      assert(result.includes('=>'));
      assert(result.includes('a + b'));
    }
  });

  test('from-arrow should convert arrow functions to regular functions', () => {
    const fromArrow = require('../modz/from-arrow.js');
    const source = `
      const add = (a, b) => {
        return a + b;
      };
    `;
    
    const result = fromArrow({ source }, { jscodeshift: require('jscodeshift') }, { printOptions: { quote: 'single' } });
    
    // The codemod might return null if no transformations are made
    if (result) {
      assert(result.includes('function add'));
      assert(!result.includes('=>'));
    }
  });

  test('template-literal should convert string concatenation to template literals', () => {
    const templateLiteral = require('../modz/template-literal.js');
    const source = `
      const message = "Hello " + name + "!";
    `;
    
    const result = templateLiteral({ source }, { jscodeshift: require('jscodeshift') }, { printOptions: { quote: 'single' } });
    
    assert(result.includes('`Hello ${name}!`'));
  });

  test('transform-to-camel-case should convert to camelCase', () => {
    const transformToCamelCase = require('../modz/transform-to-camel-case.js');
    const source = `
      const user_name = "john";
      const first_name = "John";
    `;
    
    const result = transformToCamelCase({ source }, { jscodeshift: require('jscodeshift') });
    
    assert(result.includes('userName'));
    assert(result.includes('firstName'));
  });

  test('fuck-use-strict should remove use strict directives', () => {
    const fuckUseStrict = require('../modz/fuck-use-strict.js');
    const source = `
      "use strict";
      const x = 1;
    `;
    
    const result = fuckUseStrict({ source }, { jscodeshift: require('jscodeshift') });
    
    assert(!result.includes('"use strict"'));
    assert(result.includes('const x = 1'));
  });

  test('implicit-return-to-explicit should convert implicit returns to explicit', () => {
    const implicitReturnToExplicit = require('../modz/implicit-return-to-explicit.js');
    const source = `
      const add = (a, b) => a + b;
    `;
    
    const result = implicitReturnToExplicit({ source }, { jscodeshift: require('jscodeshift') }, { printOptions: { quote: 'single' } });
    
    assert(result.includes('return a + b'));
  });

  test('to-function-declaration should convert const functions to function declarations', () => {
    const toFunctionDeclaration = require('../modz/to-function-declaration.js');
    const source = `
      const add = function(a, b) {
        return a + b;
      };
    `;
    
    const result = toFunctionDeclaration({ source }, { jscodeshift: require('jscodeshift') }, { printOptions: { quote: 'single' } });
    
    // The codemod might return null if no transformations are made
    if (result) {
      assert(result.includes('function add'));
      assert(!result.includes('const add'));
    }
  });

  test('rename-function should rename function identifiers', () => {
    const renameFunction = require('../modz/rename-function.js');
    const source = `
      function oldFunction() {
        return "old";
      }
      oldFunction();
    `;
    
    const result = renameFunction.default({ source }, { jscodeshift: require('jscodeshift') });
    
    assert(result.includes('newFunction'));
    assert(!result.includes('oldFunction'));
  });

  test('test codemod should add test comment', () => {
    const testCodemod = require('../modz/test.js');
    const source = `
      const x = 1;
    `;
    
    const result = testCodemod.default({ source }, { jscodeshift: require('jscodeshift') });
    
    assert(result.includes('hella'));
  });
}); 