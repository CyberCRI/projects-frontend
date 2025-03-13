import Image from '@tiptap/extension-image'
import { mergeAttributes } from '@tiptap/core'

export default Image.extend({
    name: 'image',

    addAttributes() {
        return {
            ...Image.config.addAttributes.call(this),
            size: {
                default: null,
                rendered: false,
            },
        }
    },

    addOptions() {
        return {
            ...Image.options,
            inline: true,
            HTMLAttributes: {},
            sizes: ['small', 'medium', 'large', 'full', 'custom', 'original'],
            allowBase64: false,
        }
    },

    inline() {
        return this.options.inline
    },

    group() {
        return this.options.inline ? 'inline' : 'block'
    },

    draggable: true,

    addCommands() {
        return {
            // This is unchanged from the original
            // Image setImage function
            // However, if I extended addComands in
            // the same way as addAttributes `this`
            // seemed to lose context, so I've just
            // copied it in here directly
            setImage:
                (options) =>
                ({ tr, dispatch }) => {
                    if (!options['size']) {
                        options = {
                            ...options,
                            size: 'original',
                        } as any // TODO: fix ts type
                    }
                    const { selection } = tr
                    const node = this.type.create(options)

                    if (dispatch) {
                        tr.replaceRangeWith(selection.from, selection.to, node)
                    }

                    return true
                },
            setSize:
                (attributes) =>
                ({ tr, dispatch }) => {
                    // Check it's a valid size option
                    // @ts-expect-error sizes
                    if (!this.options.sizes.includes(attributes.size)) {
                        return false
                    }

                    const { selection } = tr

                    const options = {
                        ...selection.node.attrs,
                        ...attributes,
                    }

                    const node = this.type.create(options)

                    if (dispatch) {
                        tr.replaceRangeWith(selection.from, selection.to, node)
                    }
                },
        }
    },

    renderHTML({ node, HTMLAttributes }) {
        // When we render the HTML, grab the
        // size and add an appropriate
        // corresponding class

        const size = node.attrs.size
        HTMLAttributes.class = ' custom-image-' + size

        return ['img', mergeAttributes(this.options.HTMLAttributes, HTMLAttributes)]
    },

    parseHTML() {
        const getAttrs = (dom) => {
            let size = 'original'
            // @ts-expect-error sizes
            this.options.sizes.forEach((s) => {
                const hasSize = (dom as HTMLElement).classList.contains('custom-image-' + s)
                if (hasSize) {
                    size = s
                }
            })
            return {
                src: (dom as HTMLElement).getAttribute('src'),
                title: (dom as HTMLElement).getAttribute('title'),
                alt: (dom as HTMLElement).getAttribute('alt'),
                size: size,
            }
        }
        return [
            {
                tag: 'img[src]',
                getAttrs,
            },
        ]
    },
})
