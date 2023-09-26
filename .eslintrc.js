module.exports = {
    root: true,

    env: {
        node: true,
        browser: true,
        es2021: true,
    },

    parserOptions: {
        parser: '@typescript-eslint/parser',
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
    },

    overrides: [
        {
            files: ['**/tests/e2e/**/*.{j,t}s'],
            globals: {
                describe: 'writable',
                before: 'writable',
            },
        },
    ],

    globals: {
        grecaptcha: 'writable',
        $: 'writable',
        $t: 'writable',
        _: 'writable',
        socket: 'writable',
        fixture: 'writable',
        test: 'writable',
        Selector: 'writable',
    },

    extends: [
        'eslint:recommended',
        'plugin:vue/vue3-strongly-recommended',
        '@vue/prettier',
        '@vue/typescript',
    ],
}
