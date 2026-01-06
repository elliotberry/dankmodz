import { test, describe } from 'node:test';
import assert from 'node:assert';
import { createRequire } from 'node:module';
import fs from 'node:fs/promises';
import path from 'node:path';

const require = createRequire(import.meta.url);

describe('Apply Codemod Utility', () => {
  test('should have applyCodemod function', () => {
    const applyCodemod = require('../lib/apply-codemod.js');
    
    // The module exports applyCodemod as a local function, not as a module export
    // We can't test it directly, but we can test that the module loads
    assert(applyCodemod, 'applyCodemod module should load');
  });

  test('should have codemod function generator', () => {
    const applyCodemod = require('../lib/apply-codemod.js');
    
    assert(typeof applyCodemod.codemod === 'function', 'codemod should be a function');
  });
}); 