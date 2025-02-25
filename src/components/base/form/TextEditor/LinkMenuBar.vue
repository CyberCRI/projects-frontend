<template>
    <div>
        <LpiBubbleMenu
            :editor="editor"
            class="linkmenu"
            :should-show="({ editor }) => editor.isActive('link')"
        >
            <ContextualToolMenu class="link-menu-bar">
                <template v-for="(item, index) in items">
                    <div class="divider" v-if="item.type === 'divider'" :key="`divider${index}`" />
                    <MenuItem v-else v-bind="item" :key="index" />
                </template>
            </ContextualToolMenu>
        </LpiBubbleMenu>
    </div>
</template>

<script>
import LpiBubbleMenu from '@/components/base/form/TextEditor/LpiBubbleMenu/LpiBubbleMenu.ts'
import MenuItem from './MenuItem.vue'
import ContextualToolMenu from './ContexttualToolMenu.vue'

export default {
    name: 'LinkMenuBar',

    components: {
        MenuItem,
        LpiBubbleMenu,
        ContextualToolMenu,
    },

    props: {
        editor: {
            type: Object,
            required: true,
        },
        openLinkModal: {
            type: Function,
            default: null,
        },
    },

    data() {
        let items = [
            {
                icon: 'external-link-line',
                title: 'multieditor.external_link',
                action: () => {
                    window.open(this.editor.getAttributes('link').href, '_blank')
                },
            },
            {
                icon: 'edit-line',
                title: 'multieditor.edit-link',
                action: () => {
                    this.openLinkModal()
                },
            },
            {
                icon: 'close-circle-line',
                title: 'multieditor.remove_link',
                action: () => this.editor.chain().focus().extendMarkRange('link').unsetLink().run(),
                isDisabled: !this.editor.can().unsetLink(),
            },
        ]

        return {
            items: items,
            isActiveLink: false,
        }
    },
}
</script>
