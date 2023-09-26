module.exports = (api) => {
    // Cache the returned value forever and don't call this function again.
    // https://babeljs.io/docs/en/config-files#apicache
    api.cache(true)

    // Default vue babel preset https://github.com/vuejs/vue-cli/tree/dev/packages/%40vue/babel-preset-app
    const presets = ['@vue/cli-plugin-babel/preset']

    // Assumptions optimize code compilation and avoid setting loose property to "true" which is less spec-compliant
    // https://babeljs.io/docs/en/babel-plugin-proposal-class-properties#loose
    // https://babeljs.io/docs/en/babel-plugin-proposal-private-property-in-object#loose
    // https://babeljs.io/docs/en/babel-plugin-proposal-decorators#note-compatibility-with-babelplugin-proposal-class-properties
    const assumptions = {
        setPublicClassFields: true,
        privateFieldsAsProperties: true,
    }

    const plugins = [
        // Plugins required with vue-class-component
        // https://class-component.vuejs.org/guide/installation.html#manual-setup
        ['@babel/proposal-decorators', { legacy: true }],
        ['@babel/plugin-proposal-class-properties'],
        ['@babel/plugin-proposal-nullish-coalescing-operator'],
        ['@babel/plugin-proposal-optional-chaining'],
    ]

    if (process.env.NODE_ENV === 'test') {
        plugins.push('require-context-hook')
    }

    return {
        presets,
        assumptions,
        plugins,
    }
}
