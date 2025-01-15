<template>
    <NodeViewWrapper class="vue-component">
        <div class="code-menu-bar" contenteditable="false">
            <label>
                {{ $t('multieditor.code.language.label') }}
                <select v-model="language">
                    <option :key="l" :value="l" v-for="l in languages">{{ l }}</option>
                </select>
            </label>
            <label>
                {{ $t('multieditor.code.theme.label') }}
                <select v-model="theme">
                    <option :key="t" :value="t" v-for="t in themes">
                        {{ $t(`multieditor.code.theme.${t}`) }}
                    </option>
                </select>
            </label>
            <label>
                {{ $t('multieditor.code.tabs.label') }}
                <select v-model="tab">
                    <option :key="t" :value="t" v-for="t in tabs">{{ t }}</option>
                </select>
            </label>
        </div>
        <pre
            class="lpi-code-block"
            :class="[`theme-${theme} tab-${tab}`]"
        ><NodeViewContent as="code" class="content-dom hljs" :class="[`language-${node.attrs.language}`]" spellcheck="false"/></pre>
    </NodeViewWrapper>
</template>

<script>
import { defineComponent } from 'vue'
import { nodeViewProps, NodeViewWrapper, NodeViewContent } from '@tiptap/vue-3'
import {
    DEFAULT_THEME,
    DEFAULT_TAB,
} from '@/components/base/form/TextEditor/tiptap-extensions/LpiCodeBlock.ts'
import lowlight from '@/functs/lowlight.ts'
import remixiconUrl from 'remixicon/fonts/remixicon.symbol.svg'

export default defineComponent({
    name: 'LpiCodeBlockNodeView',

    components: {
        NodeViewWrapper,
        NodeViewContent,
    },

    props: nodeViewProps,

    data() {
        return {
            language: 'plaintext',
            languages: lowlight.listLanguages(),
            theme: DEFAULT_THEME,
            themes: ['light', 'dark'],
            remixiconUrl,
            tabs: ['2', '4'],
            tab: DEFAULT_TAB,
        }
    },

    mounted() {
        this.language = this.node.attrs.language || 'plaintext'
        this.theme = this.node.attrs.theme || DEFAULT_THEME
        this.tab = this.node.attrs.tab || DEFAULT_TAB
    },

    watch: {
        'node.attrs.language'(neo, old) {
            if (neo != old) this.language = neo || 'plaintext'
        },

        'node.attrs.theme'(neo, old) {
            if (neo != old) this.theme = neo || DEFAULT_THEME
        },

        'node.attrs.tab'(neo, old) {
            if (neo != old) this.tab = neo || DEFAULT_TAB
        },

        language(neo, old) {
            if (neo && neo != old)
                this.updateAttributes({
                    language: neo,
                    theme: this.theme,
                    tab: this.tab,
                })
        },

        theme(neo, old) {
            if (neo && neo != old)
                this.updateAttributes({
                    language: this.language,
                    theme: neo,
                    tab: this.tab,
                })
        },

        tab(neo, old) {
            if (neo && neo != old)
                this.updateAttributes({
                    language: this.language,
                    theme: this.theme,
                    tab: neo,
                })
        },
    },
})
</script>

<style lang="scss" scoped>
.code-menu-bar {
    display: flex;
    gap: 1rem;
}
</style>
