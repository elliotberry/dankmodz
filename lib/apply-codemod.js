const {execSync} = require('child_process');
const {join} = require('path');
const fs = require('fs/promises');
const os = require('os');
const jscodeshift = require('jscodeshift');
const jsCodeShiftPath = join(__dirname, 'node_modules', 'jscodeshift', 'bin', 'jscodeshift.js');

const exists = (path) => {
  return fs.access(path)
    .then(() => true)
    .catch(() => false);
};
const createTempFile = async sourceCode => {
  let tempFilePath = join(os.tmpdir(), 'temp.js');

  await fs.writeFile(tempFilePath, sourceCode);
  return tempFilePath;
};

async function applyCodemod(text, fn = 'rename-function') {
  let fpath = await createTempFile(text);
  const codemodPath = join(__dirname, 'modz', `${fn}.js`);
  if (!(await exists(codemodPath))) {
    throw new Error(`Codemod file not found: ${codemodPath}`);
  }
  const output = execSync(`node ${jsCodeShiftPath} -t ${codemodPath} ${fpath}`, {
    input: text,
    encoding: 'utf-8',
  });

  let transformedCode = await fs.readFile(fpath, 'utf-8');
  fs.unlink(fpath);
  return transformedCode;
}

const functionGenerator = async fnName => {
  const theFunction = async () => {
    try {
      // In test environment, vscode might not be available
      if (typeof vscode !== 'undefined' && vscode.window && vscode.window.activeTextEditor) {
        const editor = vscode.window.activeTextEditor;
        const document = editor.document;
        const transformedCode = await applyCodemod(document.getText(), fnName);

        const fullRange = new vscode.Range(document.positionAt(0), document.positionAt(document.getText().length));

        editor.edit(editBuilder => {
          editBuilder.replace(fullRange, transformedCode);
        });
      }
    } catch (e) {
      console.log(e);
    }
  };
  return theFunction;
};
exports.codemod = functionGenerator;
