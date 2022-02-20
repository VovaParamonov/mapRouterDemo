const path = require('path');

const tsSettings = {
  'import/external-module-folders': ['./node_modules', './node_modules/@types'],
  'import/resolver': {
    node: {
      extensions: ['.js', '.jsx', '.ts', '.d.ts', '.tsx'],
      moduleDirectory: [
        'node_modules',
        'node_modules/@types',
        path.resolve(path.join(__dirname, 'node_modules')),
        path.resolve(path.join(__dirname, 'node_modules', '@types')),
        'src',
      ],
    },
  },
}

module.exports = {
  root: true,
  plugins: ['prettier'],
  rules: {
    'jsx-quotes': [1, 'prefer-double'],
  },
  env: {
    browser: true,
    es6: true,
    es2017: true,
  },
  parser: '@typescript-eslint/parser',
  parserOptions: {
    project: 'tsconfig.json',
    tsconfigRootDir: '.',
  },
  overrides: [
    {
      files: '*.js',
      extends: ['eslint-config-airbnb/base', 'prettier'],
    },
    {
      files: '*ts',
      parser: '@typescript-eslint/parser',
      parserOptions: {
        tsconfigRootDir: __dirname,
        project: [
          './packages/api/*/tsconfig.build.json',
          './packages/libs/*/tsconfig.build.json',
        ],
      },
      settings: tsSettings,
      extends: [
        'airbnb-typescript/base',
        'plugin:@typescript-eslint/eslint-recommended',
        'plugin:@typescript-eslint/recommended',
        'plugin:@typescript-eslint/recommended-requiring-type-checking',
        'plugin:import/errors',
        'plugin:import/warnings',
        'plugin:import/typescript',
        'prettier/@typescript-eslint',
        'prettier',
      ],
      rules: {
        'no-else-return': ['error', { allowElseIf: false }],
        'no-param-reassign': 'off',
        '@typescript-eslint/no-unused-vars': [
          'error',
          { varsIgnorePattern: '^_', argsIgnorePattern: '^_' },
        ],
      },
    },
    {
      files: '*.tsx',
      parser: '@typescript-eslint/parser',
      parserOptions: {
        tsconfigRootDir: __dirname,
        project: ['./ui/*/tsconfig.build.json'],
        ecmaFeatures: {
          jsx: true,
        },
      },
      settings: tsSettings,
      extends: [
        'airbnb-typescript',
        'plugin:@typescript-eslint/eslint-recommended',
        'plugin:@typescript-eslint/recommended',
        'plugin:@typescript-eslint/recommended-requiring-type-checking',
        'plugin:jest/all',
        'plugin:import/errors',
        'plugin:import/warnings',
        'plugin:import/typescript',
        'prettier/@typescript-eslint',
        'prettier',
      ],
      rules: {
        'quotes': ['error', 'single'],
        'no-param-reassign': 'off',
        '@typescript-eslint/no-unused-vars': [
          'error',
          { varsIgnorePattern: '^_', argsIgnorePattern: '^_' },
        ],
        'react/prop-types': ['off', { ignore: ['children'] }],
        'react/destructuring-assignment': ['off'],
        'react/state-in-constructor': ['off'],
        'jsx-a11y/label-has-associated-control': [
          'error',
          {
            required: {
              some: ['nesting', 'id'],
            },
          },
        ],
        'jsx-a11y/label-has-for': [
          'error',
          {
            required: {
              some: ['nesting', 'id'],
            },
          },
        ],
        'react/jsx-props-no-spreading': ['off'],
      },
    },
  ],
};
