import { test, describe } from 'node:test';
import assert from 'node:assert';
import { createRequire } from 'node:module';
import path from 'node:path';
import fs from 'node:fs/promises';

const require = createRequire(import.meta.url);

describe('Extension Module', () => {
  test('should have activate function', () => {
    const extension = require('../extension.js');
    
    assert(typeof extension.activate === 'function', 'Extension should have activate function');
  });

  test('should have deactivate function', () => {
    const extension = require('../extension.js');
    
    assert(typeof extension.deactivate === 'function', 'Extension should have deactivate function');
  });

  test('should have vscodemod function', () => {
    const extension = require('../extension.js');
    
    assert(typeof extension.vscodemod === 'function', 'Extension should have vscodemod function');
  });

  test('should have getCodemods function', () => {
    const extension = require('../extension.js');
    
    assert(typeof extension.getCodemods === 'function', 'Extension should have getCodemods function');
  });

  test('should have codemodSelection function', () => {
    const extension = require('../extension.js');
    
    assert(typeof extension.codemodSelection === 'function', 'Extension should have codemodSelection function');
  });
}); 