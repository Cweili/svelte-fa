import svelte from 'rollup-plugin-svelte';
import resolve from '@rollup/plugin-node-resolve';
import common from '@rollup/plugin-commonjs';
import babel from '@rollup/plugin-babel';
import pkg from './package.json' assert { type: 'json' };

export default [
  {
    input: pkg.main,
    output: [
      {
        file: pkg.browser,
        format: 'iife',
        name: 'SvelteFa',
      },
    ],
    plugins: [
      svelte({
        emitCss: false,
        compilerOptions: {
          legacy: true,
          css: true,
        },
      }),
      resolve({
        browser: true,
        exportConditions: ['svelte'],
        extensions: ['.svelte'],
      }),
      common(),
      babel({
        extensions: ['.js', '.jsx', '.es6', '.es', '.mjs', '.svelte'],
      }),
    ],
  },
  {
    input: pkg.main,
    output: [
      {
        file: pkg.module,
        format: 'es',
      },
      {
        file: pkg.browser.replace(/\.js$/, '.cjs.js'),
        format: 'cjs',
      },
    ],
    plugins: [
      svelte({
        emitCss: false,
        compilerOptions: {
          legacy: true,
          css: true,
        },
      }),
    ],
  },
];
