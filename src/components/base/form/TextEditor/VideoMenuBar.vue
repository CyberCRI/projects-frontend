<template>
    <LpiBubbleMenu
        :editor="editor"
        :should-show="({ editor }) => editor.isActive('external-video')"
        class="videomenu"
        :tippy-options="tippyOptions"
        deep-selector="iframe"
    >
        <ContextualToolMenu class="video-menu-bar">
            <TextButtonMenuItem
                v-for="(item, index) in labeled_items"
                :key="'a' + index"
                :item="item"
            ></TextButtonMenuItem>
            <template v-for="(item, index) in items">
                <div class="divider" v-if="item.type === 'divider'" :key="`divider${index}`" />
                <MenuItem v-else v-bind="item" :key="index" />
            </template>
        </ContextualToolMenu>
    </LpiBubbleMenu>
</template>

<script>
import LpiBubbleMenu from '@/components/base/form/TextEditor/LpiBubbleMenu/LpiBubbleMenu.ts'
import MenuItem from './MenuItem.vue'
import menuBarTippyOptions from './menuBarTippyOptions.js'
import ContextualToolMenu from './ContexttualToolMenu.vue'
import TextButtonMenuItem from './TextButtonMenuItem.vue'
export default {
    name: 'VideoMenuBar',

    components: {
        MenuItem,
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
        let labeled_items = [
            {
                label: 'Small',
                title: '25% width',
                action: () =>
                    this.editor.commands.updateAttributes('external-video', { size: 'small' }),
                isActive: () => this.editor.getAttributes('external-video').size == 'small',
                isDisabled: () => false,
            },
            {
                label: 'Medium',
                title: '50% width',
                action: () =>
                    this.editor.commands.updateAttributes('external-video', { size: 'medium' }),
                isActive: () => this.editor.getAttributes('external-video').size == 'medium',
                isDisabled: () => false,
            },
            {
                label: 'Large',
                title: '75% width',
                action: () =>
                    this.editor.commands.updateAttributes('external-video', { size: 'large' }),
                isActive: () => this.editor.getAttributes('external-video').size == 'large',
                isDisabled: () => false,
            },
            {
                label: 'Full',
                title: '100% width',
                action: () =>
                    this.editor.commands.updateAttributes('external-video', { size: 'full' }),
                isActive: () => this.editor.getAttributes('external-video').size == 'full',
                isDisabled: () => false,
            },
        ]

        let items = [
            {
                icon: 'close-circle-line',
                title: 'multieditor.delete_video',
                action: () => this.editor.chain().focus().deleteExternalVideo().run(),
            },
        ]

        return {
            labeled_items: labeled_items,
            items: items,
            tippyOptions: menuBarTippyOptions(this, '.ProseMirror-selectednode iframe'),
        }
    },
}
</script>
