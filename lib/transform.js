const jscodeshift = require('jscodeshift');

function empty() {}
module.exports = function codemod(source, transform) {
  try {
    const out = transform(
      { source: source },
      {
        j: jscodeshift,
        jscodeshift: jscodeshift,
        stats: empty
      },
      {}
    );
    return out == null ? source : out;
  } catch (err) {
    // In test environment, vscode might not be available
    if (typeof window !== 'undefined' && window.showErrorMessage) {
      window.showErrorMessage(`Transform failed: ${err.message}`);
    }
    return source; // Return original source on error
  }
};
