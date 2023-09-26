// Fix issue Jest to work with Webpack's using require.context used in src/locales/i18n.js
// https://github.com/storybookjs/storybook/tree/master/addons/storyshots/storyshots-core#configure-jest-to-work-with-webpacks-requirecontext
import registerRequireContextHook from 'babel-plugin-require-context-hook/register'
registerRequireContextHook()
