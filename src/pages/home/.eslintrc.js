module.exports = {
  rules: {
    '@typescript-eslint/no-unused-vars': 'off',
    '@typescript-eslint/dot-notation': 'off', // Disable dot-notation rule for this directory
    '@typescript-eslint/no-implied-eval': 'off', // Disable no-implied-eval rule for this directory
    '@typescript-eslint/no-throw-literal': 'off', // Disable no-throw-literal rule for this directory
    '@typescript-eslint/return-await': 'off', // Disable return-await rule for this directory
  },
  parserOptions: {
    project: null, // Disable TypeScript-specific linting for files in this directory
  },
};
