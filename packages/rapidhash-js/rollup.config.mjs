import typescript from '@rollup/plugin-typescript';

export default [
  // CommonJS
  {
    input: 'src/cjs/index.ts',

    output: {
      dir: 'lib/cjs/',
      format: 'cjs',
      sourcemap: true,
      preserveModules: true,
    },

    plugins: [
      typescript({
        compilerOptions: {
          rootDir: 'src/cjs/',
          module: 'ESNext',
          outDir: 'lib/cjs/',
        },
      }),
    ],
  },

  // ES modules
  {
    input: 'src/esm/index.mts',

    output: {
      dir: 'lib/esm/',
      format: 'es',
      sourcemap: true,
      preserveModules: true,
      entryFileNames: '[name].mjs',
    },

    plugins: [
      typescript({
        compilerOptions: {
          rootDir: 'src/esm/',
          module: 'ESNext',
          outDir: 'lib/esm/',
        },
      }),
    ],
  },
];
