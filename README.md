# DankModz - VS Code Extension

A collection of miscellaneous codemods for fun and profit. This VS Code extension provides various JavaScript code transformations through a simple command interface.

## Features

- **Function to Const**: Convert function declarations to const expressions
- **Arrow Function Conversion**: Convert between regular functions and arrow functions
- **Template Literals**: Convert string concatenation to template literals
- **Camel Case Transformation**: Convert snake_case to camelCase
- **Use Strict Removal**: Remove "use strict" directives
- **Implicit to Explicit Returns**: Convert implicit returns to explicit returns
- **Function Renaming**: Rename function identifiers
- **And more...**

## Installation

1. Clone this repository
2. Install dependencies: `npm install`
3. Build the extension: `npm run build`
4. Install the VSIX file in VS Code

## Usage

1. Open a JavaScript file in VS Code
2. Select the code you want to transform (optional - if no selection, entire file is processed)
3. Press `Ctrl+Shift+P` (or `Cmd+Shift+P` on Mac) to open the command palette
4. Type "DankModz: Apply Codemod" and select it
5. Choose the codemod you want to apply from the dropdown

## Development

### Prerequisites

- Node.js 18+ (for native test support)
- VS Code

### Setup

```bash
npm install
```

### Building

```bash
npm run build
```

This will:
1. Build the extension using esbuild
2. Copy codemod files to the dist directory
3. Package the extension as a VSIX file

### Testing

The project uses Node.js native test runner for comprehensive testing:

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage
```

### Test Structure

- `__tests__/transform.test.js` - Tests for the core transform functionality
- `__tests__/codemods.test.js` - Tests for individual codemod modules
- `__tests__/extension.test.js` - Tests for VS Code extension functionality
- `__tests__/build.test.js` - Tests for build process and configuration
- `__tests__/apply-codemod.test.js` - Tests for the apply-codemod utility
- `__tests__/integration.test.js` - End-to-end integration tests

### Adding New Codemods

1. Create a new file in the `modz/` directory
2. Export a function that takes `(file, api)` parameters
3. Use jscodeshift API to transform the code
4. Return the transformed source code
5. Add a `title` property for display in the UI
6. Add tests in `__tests__/codemods.test.js`

Example codemod structure:

```javascript
module.exports = function(file, api) {
  const j = api.jscodeshift;
  const root = j(file.source);
  
  // Your transformation logic here
  
  return root.toSource();
};

module.exports.title = 'My Codemod';
module.exports.description = 'Description of what this codemod does';
```

## Available Codemods

### fn-to-const
Converts function declarations to const expressions with function expressions.

**Before:**
```javascript
function hello(name) {
  return "Hello " + name;
}
```

**After:**
```javascript
const hello = function(name) {
  return "Hello " + name;
};
```

### to-arrow
Converts regular functions to arrow functions.

**Before:**
```javascript
function add(a, b) {
  return a + b;
}
```

**After:**
```javascript
const add = (a, b) => a + b;
```

### template-literal
Converts string concatenation to template literals.

**Before:**
```javascript
const message = "Hello " + name + "!";
```

**After:**
```javascript
const message = `Hello ${name}!`;
```

### transform-to-camel-case
Converts snake_case identifiers to camelCase.

**Before:**
```javascript
const user_name = "john";
const first_name = "John";
```

**After:**
```javascript
const userName = "john";
const firstName = "John";
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Add your changes
4. Add tests for new functionality
5. Run the test suite: `npm test`
6. Submit a pull request

## License

MIT License - see LICENSE file for details.

## Troubleshooting

### Common Issues

1. **Extension not loading**: Make sure you've built the extension with `npm run build`
2. **Codemods not appearing**: Check that the `modz/` directory contains valid JavaScript files
3. **Transform errors**: Ensure your JavaScript code is valid syntax

### Debug Mode

To enable debug logging, set the `DANKMODZ_DEBUG` environment variable:

```bash
export DANKMODZ_DEBUG=1
```

## Changelog

### v0.0.4
- Added comprehensive test suite
- Improved error handling
- Fixed build configuration issues
- Added proper VS Code extension metadata 