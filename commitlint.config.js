module.exports = {
    extends: ['@commitlint/config-conventional'],
    rules: {
        'body-max-line-length': [2, 'always', 120],
        'subject-empty': [1, 'never'],
        'type-empty': [1, 'never'],
        'footer-max-line-length': [2, 'always', 120],
    },
}
