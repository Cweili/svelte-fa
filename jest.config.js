module.exports = {
  testEnvironment: 'jsdom',
  moduleFileExtensions: [
    'js',
    'ts',
    'svelte',
  ],
  transform: {
    '^.+\\.[jt]s$': 'babel-jest',
    '^.+\\.svelte$': 'svelte-jester',
  },
  transformIgnorePatterns: [
    'node_modules[\\\\/](?!svelte)',
  ],
  collectCoverageFrom: ['src/**/*.js'], // disable svelte coverage since: https://github.com/sveltejs/svelte/issues/7824
};
