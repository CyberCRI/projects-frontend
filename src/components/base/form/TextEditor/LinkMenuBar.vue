<template>
    <div>
        <LpiBubbleMenu
            :editor="editor"
            class="linkmenu"
            :should-show="({ editor }) => editor.isActive('link')"
        >
            <div class="link-menu-bar">
                <template v-for="(item, index) in items">
                    <div class="divider" v-if="item.type === 'divider'" :key="`divider${index}`" />
                    <MenuItem v-else v-bind="item" :key="index" />
                </template>
            </div>
        </LpiBubbleMenu>
    </div>
</template>

<script>
import { LpiBubbleMenu } from '@/components/base/form/TextEditor/LpiBubbleMenu/LpiBubbleMenu.ts'
import MenuItem from './MenuItem.vue'

export default {
    name: 'LinkMenuBar',

    components: {
        MenuItem,
        LpiBubbleMenu,
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

<style lang="scss" scoped>
.link-menu-bar {
    position: relative;
    align-items: center;
    background: $primary-dark;
    color: $white;
    display: flex;
    padding: pxToRem(5px) pxToRem(20px);

    :deep(.menu-item) {
        color: $white;
    }

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
}
</style>
