// remove-use-strict.js

module.exports = function(fileInfo, api) {
  const j = api.jscodeshift;
  const root = j(fileInfo.source);

  // Find and remove all "use strict"; statements
  root.find(j.ExpressionStatement, {
    expression: {
      type: 'Literal',
      value: 'use strict',
    },
  }).remove();

  return root.toSource();
};
module.exports.title = 'fuck use strict';
module.exports.description = 'removes use strict';
