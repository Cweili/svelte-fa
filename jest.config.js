module.exports = {
  transform: {
    '^.+\\.[jt]sx?$': 'babel-jest',
    '^.+\\.svelte$': 'svelte-jester',
  },
  transformIgnorePatterns: [
    'node_modules[\\\\/](?!svelte)',
  ],
};
