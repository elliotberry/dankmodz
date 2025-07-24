const transform = require('./lib/transform.js');
const vscode = require('vscode');
const path = require('path');
const fsp = require('fs').promises;

const { window, Range } = vscode;


function deactivate() {}
exports.deactivate = deactivate;

function codemodSelection(e, doc, sel, fn) {
  e.edit(function(edit) {
    for (let x = 0; x < sel.length; x++) {
      const txt = doc.getText(new Range(sel[x].start, sel[x].end));
      const out = transform(txt, fn);
      edit.replace(sel[x], out);
    }
  });
}

function getFunction(items, label) {
  return items.find(i => i.label === label).fn;
}

const basedir = path.resolve(__dirname, 'modz');

function getCodemods() {
  return fsp.readdir(basedir)
    .catch(err => window.showErrorMessage(err.message))
    .then(files => files.filter(f => path.extname(f) === '.js'))
    .then(items =>
      items.map(i => require(path.join(basedir, i))).map(i => ({
        label: i.title,
        description: i.description,
        fn: i
      }))
    );
}

function vscodemod() {
  if (!vscode.window.activeTextEditor) {
    window.showInformationMessage('Open a file first to manipulate text selections');
    return;
  }

  getCodemods().then(function(items) {
    window.showQuickPick(items).then(selection => {
      if (!selection || !selection.label) return;
      const fn = getFunction(items, selection.label);

      const e = window.activeTextEditor;
      const d = e.document;
      const sel = e.selections;

      codemodSelection(e, d, sel, fn);
    });
  });
}

function activate(context) {
  const disposable = vscode.commands.registerCommand('dankmodz.vscodeMod', vscodemod);
  context.subscriptions.push(disposable);
}
exports.activate = activate;
