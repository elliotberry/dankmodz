function transformToCamelCase(file, api) {
  const j = api.jscodeshift;
  const root = j(file.source);

  root.find(j.Identifier)
    .forEach(path => {
      const originalName = path.node.name;
      const camelCaseName = originalName
        .split('_')
        .map((word, index) => index === 0 ? word : word.charAt(0).toUpperCase() + word.slice(1))
        .join('');
      
      if (camelCaseName !== originalName) {
        j(path).replaceWith(j.identifier(camelCaseName));
      }
    });

  return root.toSource();
}

module.exports = transformToCamelCase;