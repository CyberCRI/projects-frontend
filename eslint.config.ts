import eslintPluginPrettierRecommended from 'eslint-plugin-prettier/recommended'
import withNuxt from './.nuxt/eslint.config.mjs'

export default withNuxt([
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
      '@typescript-eslint/ban-ts-comment': 'off',
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/no-dynamic-delete': 'off',
      // 'vue/no-undef-properties': 'error',
      'vue/attribute-hyphenation': ['error', 'always', { ignoreTags: ['deep-chat'] }],
    },
  },
  {
    // overrides
    files: ['**/tests/e2e/**/*.{j,t}s'],
  },
  eslintPluginPrettierRecommended,
])
