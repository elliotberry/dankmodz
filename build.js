const esbuild = require('esbuild')
const path = require('path');
const fs = require('fs');
// Define entry and output paths
const entryFile = './extension.js';
const outDir = 'dist';
const utilsDir = 'modz';
const { copy } = require('esbuild-plugin-copy');
// Get all files from utils directory to add as additional entry points
const utilsEntries = fs.readdirSync(utilsDir)
  .filter(file => file.endsWith('.ts'))
  .map(file => join(utilsDir, file));
async function main() {
  await esbuild.build({
    entryPoints: [entryFile, ...utilsEntries],
    bundle: true,
    platform: 'node', // Targeting Node.js for VS Code
    target: 'es2020',
    outfile: path.join(outDir, 'extension.js'),
    external: [ // Exclude VS Code modules and dependencies
      'vscode'
    ],
    sourcemap: true, // Helpful for debugging
    minify: true, // Set to true for production builds
    format: 'cjs', // CommonJS is typically used for Node.js
     plugins: [
      copy({
        // this is equal to process.cwd(), which means we use cwd path as base path to resolve `to` path
        // if not specified, this plugin uses ESBuild.build outdir/outfile options as base path.
        resolveFrom: 'cwd',
        assets: {
          from: ['./modz/*'],
          to: ['./dist/modz'],
        },
        watch: true,
      }),
    ]
  }).catch(() => process.exit(1));
}

main();