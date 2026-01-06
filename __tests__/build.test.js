import { test, describe } from 'node:test';
import assert from 'node:assert';
import { createRequire } from 'node:module';
import fs from 'node:fs/promises';
import path from 'node:path';

const require = createRequire(import.meta.url);

describe('Build Process', () => {
  test('should have valid entry file', async () => {
    const entryFile = './extension.js';
    const stats = await fs.stat(entryFile);
    assert(stats.isFile(), 'Entry file should exist');
  });

  test('should have valid modz directory', async () => {
    const modzDir = './modz';
    const stats = await fs.stat(modzDir);
    assert(stats.isDirectory(), 'Modz directory should exist');
  });

  test('should have JavaScript files in modz directory', async () => {
    const modzDir = './modz';
    const files = await fs.readdir(modzDir);
    const jsFiles = files.filter(file => file.endsWith('.js'));
    
    assert(jsFiles.length > 0, 'Should have at least one JavaScript file in modz directory');
  });

  test('should have required properties in package.json', () => {
    const packageJson = require('../package.json');
    
    assert(packageJson.name, 'Should have name');
    assert(packageJson.displayName, 'Should have displayName');
    assert(packageJson.description, 'Should have description');
    assert(packageJson.version, 'Should have version');
    assert(packageJson.publisher, 'Should have publisher');
    assert(packageJson.main, 'Should have main entry point');
    assert(packageJson.engines, 'Should have engines');
    assert(packageJson.contributes, 'Should have contributes');
  });

  test('should have valid VS Code engine version', () => {
    const packageJson = require('../package.json');
    const engineVersion = packageJson.engines.vscode;
    
    assert(engineVersion, 'Should have vscode engine version');
    assert(engineVersion.startsWith('^'), 'Should use caret versioning');
  });

  test('should have valid command contribution', () => {
    const packageJson = require('../package.json');
    const commands = packageJson.contributes.commands;
    
    assert(Array.isArray(commands), 'Commands should be an array');
    assert(commands.length > 0, 'Should have at least one command');
    
    const command = commands[0];
    assert(command.command, 'Command should have command property');
    assert(command.title, 'Command should have title property');
  });

  test('should have required dependencies', () => {
    const packageJson = require('../package.json');
    
    assert(packageJson.dependencies, 'Should have dependencies');
    assert(packageJson.dependencies.jscodeshift, 'Should have jscodeshift dependency');
    assert(packageJson.devDependencies, 'Should have devDependencies');
    assert(packageJson.devDependencies.esbuild, 'Should have esbuild devDependency');
  });

  test('should have valid build script', () => {
    const packageJson = require('../package.json');
    const buildScript = packageJson.scripts.build;
    
    assert(buildScript, 'Should have build script');
    assert(buildScript.includes('node build.js'), 'Build script should run build.js');
  });

  test('should have valid test script', () => {
    const packageJson = require('../package.json');
    const testScript = packageJson.scripts.test;
    
    assert(testScript, 'Should have test script');
    assert(testScript.includes('node --test'), 'Test script should use node --test');
  });
}); 