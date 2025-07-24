module.exports.title = 'test lol';
module.exports.default = function transformer(file, api) {
  console.log(Arguments);
  const j = api.jscodeshift;
  const root = j(file.source);

  const hellaComment = j.expressionStatement(j.identifier('hella'));

  root.get().node.program.body.unshift(hellaComment);

  return root.toSource({quote: 'single'});
};
