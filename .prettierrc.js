module.exports = {
  // Specify the line length that the printer will wrap on.
  printWidth: 150,

  // Specify the number of spaces per indentation-level.
  tabWidth: 2,

  // Indent lines with tabs instead of spaces.
  useTabs: false,

  // Print semicolons at the ends of statements.
  semi: true,

  // Use single quotes instead of double quotes.
  singleQuote: true,

  // Change when properties in objects are quoted.
  quoteProps: 'as-needed',

  // Use single quotes instead of double quotes in JSX.
  jsxSingleQuote: true,

  // Print trailing commas wherever possible when multi-line.
  trailingComma: 'es5',

  // Print spaces between brackets in object literals.
  bracketSpacing: true,

  // Include parentheses around a sole arrow function parameter.
  arrowParens: 'always',

  // Format only a segment of a file.
  rangeStart: 0,
  rangeEnd: Infinity,

  // Specify which parser to use.
  parser: 'typescript',

  // Specify the file format.
  filepath: '',

  // By default, Prettier will wrap markdown text as-is since some services use a linebreak-sensitive renderer, e.g. GitHub comment and BitBucket.
  proseWrap: 'preserve',

  // Include parentheses around a sole arrow function parameter.
  arrowParens: 'always',

  // Format embedded code if Prettier can automatically identify it.
  embeddedLanguageFormatting: 'auto',
};
