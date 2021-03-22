module.exports = {
    root: true,
    env: {
        node: true
    },
    extends: [
        'plugin:vue/vue3-essential',
        '@vue/standard',
        '@vue/typescript/recommended'
    ],
    parserOptions: {
        ecmaVersion: 2020
    },
    rules: {
        indent: ['error', 4],
        semi: [2, 'never'],
        quotes: 'off',
        '@typescript-eslint/no-var-requires': 'off',
        '@typescript-eslint/quotes': [
            'error',
            'single',
            { avoidEscape: true, allowTemplateLiterals: true }
        ],
        'vue/script-indent': ['error', 4, { baseIndent: 0 }],
        'no-console': process.env.NODE_ENV === 'production' ? 'error' : 'off',
        'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off',
        'comma-dangle': ['error', 'never'],
        'space-before-function-paren': ['error', {
            anonymous: 'always',
            named: 'never',
            asyncArrow: 'always'
        }]
    }
}
