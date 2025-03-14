// eslint.config.js
import { defineConfig } from 'eslint/config'
import { includeIgnoreFile } from '@eslint/compat'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const gitignorePath = path.resolve(__dirname, '.gitignore')

import pluginVue from 'eslint-plugin-vue'
import globals from 'globals'
import tseslint from 'typescript-eslint'
import eslintPluginPrettierRecommended from 'eslint-plugin-prettier/recommended'

export default defineConfig([
  includeIgnoreFile(gitignorePath),
  tseslint.configs.recommended,
  ...pluginVue.configs['flat/recommended'],
  {
    ignores: [
      '**/.*',
      'src/functs/dotatlas.js',
      'src/assets',
      'dist',
      'docs',
      'deployment',
      '.storybook',
      '.husky',
      '.github',
      'public',
    ],
  },
  {
    // env: {
    //     node: true,
    //     browser: true,
    //     es2021: true,
    // },

    languageOptions: {
      sourceType: 'module',
      parserOptions: {
        parser: '@typescript-eslint/parser',
      },
      globals: {
        ...globals.browser,
        grecaptcha: 'writable',
        $: 'writable',
        $t: 'writable',
        _: 'writable',
        socket: 'writable',
        fixture: 'writable',
        test: 'writable',
        Selector: 'writable',
      },
    },

    rules: {
      'no-console': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
      'no-debugger': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
      'vue/no-v-html': 'off',
      'vue/no-v-text-v-html-on-component': 'off',
      omitLastInOneLineBlock: 'off',
      'no-var': 'error',
      'vue/no-unused-properties': [
        'error',
        {
          groups: ['props', 'methods', 'computed'],
          deepData: false,
        },
      ],
      'vue/require-name-property': 'error',
      'vue/no-multiple-template-root': 'off',
      'vue/match-component-file-name': [
        'error',
        {
          extensions: ['vue'],
          shouldMatchCase: true,
        },
      ],
      'vue/component-name-in-template-casing': [
        'error',
        'PascalCase',
        {
          registeredComponentsOnly: true,
        },
      ],
      '@typescript-eslint/no-explicit-any': 'off',
    },

    // globals: {
    //     grecaptcha: 'writable',
    //     $: 'writable',
    //     $t: 'writable',
    //     _: 'writable',
    //     socket: 'writable',
    //     fixture: 'writable',
    //     test: 'writable',
    //     Selector: 'writable',
    // },

    // extends: [
    //     'eslint:recommended',
    //     'plugin:vue/vue3-strongly-recommended',
    //     '@vue/prettier',
    //     '@vue/typescript',
    // ],

    settings: {
      'import/resolver': {
        node: {
          paths: ['src'],
          extensions: ['.js', '.jsx', '.ts', '.d.ts', '.tsx'],
        },
        typescript: {
          project: './tsconfig.json',
        },
        alias: {
          map: [['@', path.resolve(__dirname, './src')]],
          extensions: ['.js', '.jsx', '.ts', '.d.ts', '.tsx'],
        },
      },
    },
  },
  {
    // overrides
    files: ['**/tests/e2e/**/*.{j,t}s'],
    globals: {
      describe: 'writable',
      before: 'writable',
    },
  },
  eslintPluginPrettierRecommended,
])
