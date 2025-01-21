import CodeBlockLowlight from '@tiptap/extension-code-block-lowlight'
import LpiCodeBlockNodeView from './LpiCodeBlockNodeView.vue'
import { VueNodeViewRenderer } from '@tiptap/vue-3'
import { mergeAttributes } from '@tiptap/core'
import { CodeBlockLowlightOptions } from '@tiptap/extension-code-block-lowlight'
import { PluginKey } from '@tiptap/pm/state'

export const DEFAULT_THEME = 'light'
export const DEFAULT_TAB = '2'

export interface LpiBlockOptions extends CodeBlockLowlightOptions {
    tabClassPrefix: string
    themeClassPrefix: string
    defaultTheme: string | null | undefined
}

export default CodeBlockLowlight.extend<LpiBlockOptions>({
    addOptions() {
        return {
            ...this.parent?.(),
            themeClassPrefix: 'theme-',
            tabClassPrefix: 'tab-',
            defaultTheme: DEFAULT_THEME,
            defaultTab: DEFAULT_TAB,
            key: new PluginKey('lpiCodeBlock'),
        }
    },

    addNodeView() {
        return VueNodeViewRenderer(LpiCodeBlockNodeView as any)
    },

    addAttributes() {
        return {
            ...this.parent?.(),

            theme: {
                default: null,
                parseHTML: (element) => {
                    const { themeClassPrefix } = this.options
                    const classNames = [...(element?.classList || [])]
                    const themes = classNames
                        .filter((className) => className.startsWith(themeClassPrefix))
                        .map((className) => className.replace(themeClassPrefix, ''))
                    const theme = themes[0]

                    if (!theme) {
                        return DEFAULT_THEME
                    }

                    return theme
                },
                rendered: false,
            },

            tab: {
                default: null,
                parseHTML: (element) => {
                    const { tabClassPrefix } = this.options
                    const classNames = [...(element?.classList || [])]
                    const tabs = classNames
                        .filter((className) => className.startsWith(tabClassPrefix))
                        .map((className) => className.replace(tabClassPrefix, ''))
                    const tab = tabs[0]

                    if (!tab) {
                        return DEFAULT_TAB
                    }

                    return tab
                },
                rendered: false,
            },
        }
    },

    parseHTML() {
        return [
            {
                tag: 'pre.lpi-code-block',
                preserveWhitespace: 'full',
            },
        ]
    },

    renderHTML({ node, HTMLAttributes }) {
        const langClass = node.attrs.language
            ? this.options.languageClassPrefix + node.attrs.language
            : null

        const themeClass = node.attrs.theme
            ? this.options.themeClassPrefix + node.attrs.theme
            : this.options.themeClassPrefix + DEFAULT_THEME

        const tabClass = node.attrs.tab
            ? this.options.tabClassPrefix + node.attrs.tab
            : this.options.tabClassPrefix + DEFAULT_TAB

        return [
            'pre',
            mergeAttributes(this.options.HTMLAttributes, HTMLAttributes, {
                class: `lpi-code-block ${themeClass} ${tabClass}`,
            }),
            [
                'code',
                {
                    class: langClass,
                    spellcheck: 'false',
                },
                0,
            ],
        ]
    },
})
