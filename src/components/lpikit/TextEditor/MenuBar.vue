<template>
    <div>
        <div class="icons">
            <template v-for="(item, index) in items">
                <div v-if="item.type === 'divider'" :key="`divider${index}`" class="divider" />
                <MenuItem v-else v-bind="item" :key="index" :is-disabled="item.isDisabled" />
            </template>
        </div>
    </div>
</template>

<script>
import MenuItem from './MenuItem.vue'

export default {
    name: 'MenuBar',

    emits: ['saved'],

    components: {
        MenuItem,
    },

    props: {
        editor: {
            type: Object,
            required: true,
        },
        mode: {
            type: String,
            default: 'simple',
        },
        openLinkModal: {
            type: Function,
            default: null,
        },
        openColorModal: {
            type: Function,
            default: null,
        },
        openVideoModal: {
            type: Function,
            default: null,
        },
        openImageModal: {
            type: Function,
            default: null,
        },
        saveIconVisible: {
            type: Boolean,
            default: true,
        },
    },

    computed: {
        items() {
            if (this.mode === 'simple') {
                return [
                    {
                        icon: 'bold',
                        title: 'multieditor.bold',
                        action: () => this.editor.chain().focus().toggleBold().run(),
                        isActive: () => this.editor.isActive('bold'),
                        isDisabled: false,
                    },
                    {
                        icon: 'italic',
                        title: 'multieditor.italic',
                        action: () => this.editor.chain().focus().toggleItalic().run(),
                        isActive: () => this.editor.isActive('italic'),
                        isDisabled: false,
                    },
                    {
                        icon: 'underline',
                        title: 'multieditor.underline',
                        action: () => this.editor.chain().focus().toggleUnderline().run(),
                        isActive: () => this.editor.isActive('underline'),
                        isDisabled: false,
                    },
                    {
                        type: 'divider',
                    },

                    // EASTER BUG 4 no link button
                    // {
                    //     icon: 'link',
                    //     title: 'multieditor.link',
                    //     action: () => this.openLinkModal(),
                    //     isActive: () => this.editor.isActive('link'),
                    //     isDisabled: false,
                    // },
                ]
            }
            const menuItems = [
                {
                    icon: 'bold',
                    title: 'multieditor.bold',
                    action: () => this.editor.chain().focus().toggleBold().run(),
                    isActive: () => this.editor.isActive('bold'),
                    isDisabled: false,
                },
                {
                    icon: 'italic',
                    title: 'multieditor.italic',
                    action: () => this.editor.chain().focus().toggleItalic().run(),
                    isActive: () => this.editor.isActive('italic'),
                    isDisabled: false,
                },
                {
                    icon: 'underline',
                    title: 'multieditor.underline',
                    action: () => this.editor.chain().focus().toggleUnderline().run(),
                    isActive: () => this.editor.isActive('underline'),
                    isDisabled: false,
                },
                {
                    type: 'divider',
                },
                {
                    icon: 'palette-line',
                    title: 'multieditor.color.color',
                    action: () => this.openColorModal(),
                    isActive: () => this.editor.isActive('textStyle'),
                    isDisabled: false,
                },
                {
                    type: 'divider',
                },
                {
                    icon: 'h-1',
                    title: 'multieditor.heading_1',
                    action: () => this.editor.chain().focus().toggleHeading({ level: 1 }).run(),
                    isActive: () => this.editor.isActive('heading', { level: 1 }),
                    isDisabled: false,
                },
                {
                    icon: 'h-2',
                    title: 'multieditor.heading_2',
                    action: () => this.editor.chain().focus().toggleHeading({ level: 2 }).run(),
                    isActive: () => this.editor.isActive('heading', { level: 2 }),
                    isDisabled: false,
                },
                {
                    icon: 'h-3',
                    title: 'multieditor.heading_3',
                    action: () => this.editor.chain().focus().toggleHeading({ level: 3 }).run(),
                    isActive: () => this.editor.isActive('heading', { level: 3 }),
                    isDisabled: false,
                },
                {
                    type: 'divider',
                },
                {
                    icon: 'align-left',
                    title: 'multieditor.text_align_left',
                    action: () =>
                        this.editor.isActive('external-video')
                            ? this.editor.commands.updateAttributes('external-video', {
                                  align: 'left',
                              })
                            : this.editor.chain().focus().setTextAlign('left').run(),
                    isActive: () =>
                        this.editor.isActive('external-video')
                            ? this.editor.isActive({ align: 'left' })
                            : this.editor.isActive({ textAlign: 'left' }),
                    isDisabled: false,
                },
                {
                    icon: 'align-center',
                    title: 'multieditor.text_align_center',
                    action: () =>
                        this.editor.isActive('external-video')
                            ? this.editor.commands.updateAttributes('external-video', {
                                  align: 'center',
                              })
                            : this.editor.chain().focus().setTextAlign('center').run(),
                    isActive: () =>
                        this.editor.isActive('external-video')
                            ? this.editor.isActive({ align: 'center' })
                            : this.editor.isActive({ textAlign: 'center' }),
                    isDisabled: false,
                },
                {
                    icon: 'align-right',
                    title: 'multieditor.text_align_right',
                    action: () =>
                        this.editor.isActive('external-video')
                            ? this.editor.commands.updateAttributes('external-video', {
                                  align: 'right',
                              })
                            : this.editor.chain().focus().setTextAlign('right').run(),

                    isActive: () =>
                        this.editor.isActive('external-video')
                            ? this.editor.isActive({ align: 'right' })
                            : this.editor.isActive({ textAlign: 'right' }),
                    isDisabled: false,
                },
                {
                    type: 'divider',
                },

                // EASTER BUG 4bis no link button
                // {
                //     icon: 'link',
                //     title: 'multieditor.link',
                //     action: () => this.openLinkModal(),
                //     isActive: () => this.editor.isActive('link'),
                //     isDisabled: false,
                // },
                {
                    icon: 'list-unordered',
                    title: 'multieditor.bullet_list',
                    action: () => this.editor.chain().focus().toggleBulletList().run(),
                    isActive: () => this.editor.isActive('bulletList'),
                    isDisabled: false,
                },
                {
                    icon: 'table-2',
                    title: 'multieditor.table',
                    action: () =>
                        this.editor
                            .chain()
                            .focus()
                            .insertTable({ rows: 3, cols: 3, withHeaderRow: true })
                            .run(),
                    isActive: () => this.editor.isActive('table'),
                    isDisabled: false,
                },
                {
                    icon: 'double-quotes-l',
                    title: 'multieditor.blockquote',
                    action: () => this.editor.chain().focus().toggleBlockquote().run(),
                    isActive: () => this.editor.isActive('blockquote'),
                    isDisabled: false,
                },
                {
                    icon: 'code-s-slash-line',
                    title: 'multieditor.code.label',
                    action: () => this.editor.chain().focus().toggleCodeBlock().run(),
                    isActive: () => this.editor.isActive('codeBlock'),
                    isDisabled: false,
                },
                {
                    type: 'divider',
                },
            ]

            if (this.mode === 'full') {
                menuItems.push(
                    {
                        icon: 'image-fill',
                        title: 'multieditor.image.image',
                        action: () => this.openImageModal(),
                        isDisabled: false,
                    },
                    {
                        icon: 'film-fill',
                        title: 'multieditor.video',
                        action: () => this.openVideoModal(),
                        isDisabled: false,
                    },
                    {
                        type: 'divider',
                    }
                )
            }

            menuItems.push(
                {
                    icon: 'arrow-go-back-line',
                    title: 'multieditor.undo',
                    action: () => this.editor.chain().focus().undo().run(),
                    isDisabled: false,
                },
                {
                    icon: 'arrow-go-forward-line',
                    title: 'multieditor.redo',
                    action: () => this.editor.chain().focus().redo().run(),
                    isDisabled: false,
                }
            )

            if (this.saveIconVisible) {
                menuItems.push(
                    {
                        type: 'divider',
                    },
                    {
                        icon: 'save-line',
                        title: 'multieditor.save',
                        action: () => this.$emit('saved'),
                        isDisabled: false,
                    }
                )
            }

            return menuItems
        },
    },
}
</script>

<style lang="scss" scoped>
.divider {
    width: 2px;
    height: 1.25rem;
    background: $black;
    opacity: 0.1;
    margin-left: 0.5rem;
    margin-right: 0.75rem;
}

.icons {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
}

.b-tooltip.is-primary .tooltip-content {
    color: $black !important;
    left: unset !important;
    width: auto !important;
}

:deep(.b-tooltip.is-primary .tooltip-content) {
    min-width: 0 !important;
    padding: 10px !important;
}
</style>
