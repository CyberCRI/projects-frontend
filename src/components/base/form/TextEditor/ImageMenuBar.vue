<template>
    <LpiBubbleMenu
        :editor="editor"
        :should-show="({ editor }) => editor.isActive('image')"
        class="tablemenu"
        :tippy-options="tippyOptions"
    >
        <ContextualToolMenu class="image-menu-bar">
            <TextButtonMenuItem
                v-for="(item, index) in items"
                :key="index"
                :item="item"
            ></TextButtonMenuItem>
        </ContextualToolMenu>
    </LpiBubbleMenu>
</template>

<script>
import { LpiBubbleMenu } from '@/components/base/form/TextEditor/LpiBubbleMenu/LpiBubbleMenu.ts'
import menuBarTippyOptions from './menuBarTippyOptions.js'
import ContextualToolMenu from './ContexttualToolMenu.vue'
import TextButtonMenuItem from './TextButtonMenuItem.vue'
export default {
    name: 'ImageMenuBar',

    components: {
        LpiBubbleMenu,
        ContextualToolMenu,
        TextButtonMenuItem,
    },

    props: {
        editor: {
            type: Object,
            required: true,
        },
    },

    data() {
        let items = [
            {
                label: this.$t('multieditor.image.small'),
                title: this.$t('multieditor.image.25_width'),
                action: this.fixSelection(() =>
                    this.editor.commands.updateAttributes('image', { size: 'small' })
                ),
                isActive: () => this.editor.getAttributes('image').size === 'small',
                isDisabled: () => false,
            },
            {
                label: this.$t('multieditor.image.medium'),
                title: this.$t('multieditor.image.50_width'),
                action: this.fixSelection(() =>
                    this.editor.commands.updateAttributes('image', { size: 'medium' })
                ),
                isActive: () => this.editor.getAttributes('image').size === 'medium',
                isDisabled: () => false,
            },
            {
                label: this.$t('multieditor.image.large'),
                title: this.$t('multieditor.image.75_width'),
                action: this.fixSelection(() =>
                    this.editor.commands.updateAttributes('image', { size: 'large' })
                ),
                isActive: () => this.editor.getAttributes('image').size === 'large',
                isDisabled: () => false,
            },
            {
                label: this.$t('multieditor.image.full'),
                title: this.$t('multieditor.image.100_width'),
                action: this.fixSelection(() =>
                    this.editor.commands.updateAttributes('image', { size: 'full' })
                ),
                isActive: () => this.editor.getAttributes('image').size === 'full',
                isDisabled: () => false,
            },
            {
                label: this.$t('multieditor.image.original'),
                title: this.$t('multieditor.image.original_size'),
                action: this.fixSelection(() =>
                    this.editor.commands.updateAttributes('image', { size: 'original' })
                ),
                isActive: () => this.editor.getAttributes('image').size === 'original',
                isDisabled: () => false,
            },
        ]

        return {
            items,
            tippyOptions: menuBarTippyOptions(this),
        }
    },

    methods: {
        fixSelection(wrapped) {
            return () => {
                let sel = null
                this.editor
                    .chain()
                    .focus()
                    .command((arg) => {
                        sel = arg.state.selection
                        return true
                    })
                    .run()
                wrapped()
                this.editor.chain().focus().setNodeSelection(sel.ranges[0].$from.pos).run()
            }
        },
    },
}
</script>

<style lang="scss" scoped>
.image-menu-bar {
    &::after {
        content: '';
        width: 0;
        height: 0;
        border-left: 10px solid transparent;
        border-right: 10px solid transparent;
        border-top: 10px solid $primary-dark;
        position: absolute;
        top: 100%;
        left: 50%;
        transform: translate(-50%, 0);
    }

    .custom-width-input {
        display: block;
        flex-grow: 1;
        flex-shrink: 1;

        input {
            font-size: $font-size-xs;
            height: 24px;
            width: 60px;
        }
    }
}
</style>
