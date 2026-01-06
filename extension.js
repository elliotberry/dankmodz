const transform = require('./lib/transform.js');
const path = require('path');
const fsp = require('fs').promises;

// In test environment, vscode might not be available
let vscode;
try {
  vscode = require('vscode');
} catch (e) {
  // Mock vscode for testing
  vscode = {
    window: {
      showErrorMessage: () => {},
      showInformationMessage: () => {},
      showQuickPick: () => Promise.resolve(null),
      activeTextEditor: null
    },
    commands: {
      registerCommand: () => ({ dispose: () => {} })
    },
    Range: class Range {
      constructor(start, end) {
        this.start = start;
        this.end = end;
      }
    }
  };
}

const { window, Range } = vscode;


function deactivate() {}
exports.deactivate = deactivate;

// Export functions for testing
exports.vscodemod = vscodemod;
exports.getCodemods = getCodemods;
exports.codemodSelection = codemodSelection;

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
    .catch(err => {
      window.showErrorMessage(`Failed to read codemods directory: ${err.message}`);
      return [];
    })
    .then(files => files.filter(f => path.extname(f) === '.js'))
    .then(items => {
      try {
        return items.map(i => require(path.join(basedir, i))).map(i => ({
          label: i.title,
          description: i.description,
          fn: i
        }));
      } catch (err) {
        window.showErrorMessage(`Failed to load codemod: ${err.message}`);
        return [];
      }
    });
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
