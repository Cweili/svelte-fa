import resolve from '@rollup/plugin-node-resolve';
import replace from '@rollup/plugin-replace';
import babel from '@rollup/plugin-babel';
import svelte from 'rollup-plugin-svelte';
import postcss from 'rollup-plugin-postcss';

export default {
  input: 'index.js',
  output: {
    file: 'dist/index.js',
    name: 'svelteFaExamples',
    format: 'iife',
    globals: {
      'svelte-fa': 'SvelteFa',
    },
  },
  external: ['svelte-fa'],
  plugins: [
    svelte({
      legacy: true,
    }),
    resolve({
      browser: true,
    }),
    replace({
      'process.env.NODE_ENV': JSON.stringify('production'),
    }),
    babel({
      extensions: ['.js', '.jsx', '.es6', '.es', '.mjs', '.svelte'],
    }),
    postcss({
      extensions: ['.css'],
    }),
  ],
};
