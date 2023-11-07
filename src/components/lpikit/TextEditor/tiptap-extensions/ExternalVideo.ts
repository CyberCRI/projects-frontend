import { Node, mergeAttributes } from '@tiptap/core'

const getFormattedSrc = (newVideoId) => {
    let resolvedid: String
    let link: String

    if (newVideoId.includes('vimeo.com/')) {
        const spliturl = newVideoId.split('/')
        resolvedid = spliturl[spliturl.length - 1]
        link = `https://player.vimeo.com/video/${resolvedid}`
    }

    if (newVideoId.includes('youtube.com/')) {
        const ytOptions =
            '?modestbranding=1&amp;fs=0&amp;rel=0&amp;hd=1&amp;disablekb=0&amp;showinfo=0&amp;iv_load_policy=0&amp;enablejsapi=1&amp;autoplay=0&amp;loop=0'
        // this test fix issue when formated src is reprocessed a second time
        if (
            newVideoId.includes('https://www.youtube.com/embed/') &&
            newVideoId.includes(ytOptions)
        ) {
            link = newVideoId
        } else {
            let urlstr
            if (newVideoId.includes('https://')) {
                urlstr = newVideoId
            } else if (newVideoId.includes('http://')) {
                urlstr = newVideoId.replace('http://', 'https://')
            } else {
                urlstr = 'https://' + newVideoId
            }
            const surl = new URL(urlstr)
            resolvedid = surl.searchParams.get('v')
            link = 'https://www.youtube.com/embed/' + resolvedid + ytOptions
        }
    }

    if (newVideoId.includes('youtu.be/')) {
        const spliturl = newVideoId.split('/')
        resolvedid = spliturl[spliturl.length - 1]
        link =
            'https://www.youtube.com/embed/' +
            resolvedid +
            '?modestbranding=1&amp;fs=0&amp;rel=0&amp;hd=1&amp;disablekb=0&amp;showinfo=0&amp;iv_load_policy=0&amp;enablejsapi=1&amp;autoplay=0&amp;loop=0'
    }

    return link
}

export default Node.create({
    name: 'external-video',

    addOptions() {
        return {
            inline: false,
            HTMLAttributes: {},
            sizes: ['small', 'medium', 'large', 'full', 'custom'],
            aligns: ['left', 'center', 'right'],
        }
    },

    inline() {
        return this.options.inline
    },

    group() {
        return this.options.inline ? 'inline' : 'block'
    },

    draggable: true,

    addAttributes() {
        return {
            src: {
                default: null,
            },
            title: {
                default: null,
            },
            frameborder: {
                default: '0',
            },
            allow: {
                default:
                    'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture',
            },
            allowfullscreen: {
                default: 'allowfullscreen',
            },
            size: {
                default: 'large',
                rendered: false,
            },
            align: {
                default: 'center',
                rendered: false,
            },
        }
    },

    parseHTML() {
        return [
            {
                // old version for retro compatibility
                tag: 'iframe',
                getAttrs: (node) => {
                    if ((node as HTMLElement).classList.contains('custom-video')) {
                        return false
                    }
                    return {
                        src: (node as HTMLElement).getAttribute('src'),
                        title: (node as HTMLElement).getAttribute('title'),
                        frameborder: (node as HTMLElement).getAttribute('frameborder'),
                        allow: (node as HTMLElement).getAttribute('allow'),
                        allowfullscreen: (node as HTMLElement).getAttribute('allowfullscreen'),
                        size: 'large',
                        align: 'center',
                    }
                },
            },
            {
                // new version
                tag: 'div.custom-video-wrapper',
                getAttrs: (wrapper) => {
                    const node = (wrapper as HTMLElement).querySelector('.custom-video')
                    if (!node) return false

                    let size = 'large'
                    this.options.sizes.forEach((s) => {
                        const hasSize = (wrapper as HTMLElement).classList.contains(
                            'custom-video-wrapper-' + s
                        )
                        if (hasSize) {
                            size = s
                        }
                    })

                    let align = 'center'
                    this.options.aligns.forEach((s) => {
                        const hasAlign = (wrapper as HTMLElement).classList.contains(
                            'custom-video-wrapper-' + s
                        )
                        if (hasAlign) {
                            align = s
                        }
                    })

                    return {
                        src: node.getAttribute('src'),
                        title: node.getAttribute('title'),
                        frameborder: node.getAttribute('frameborder'),
                        allow: node.getAttribute('allow'),
                        allowfullscreen: node.getAttribute('allowfullscreen'),
                        size: size,
                        align: align,
                    }
                },
            },
        ]
    },

    renderHTML({ node, HTMLAttributes }) {
        HTMLAttributes.src = getFormattedSrc(HTMLAttributes.src)
        HTMLAttributes.width = '440px'
        HTMLAttributes.height = '220px'
        HTMLAttributes.frameborder = 0
        HTMLAttributes.allowfullscreen = true

        const size = node.attrs.size
        const align = node.attrs.align
        HTMLAttributes.class = 'custom-video custom-video-' + size + ' ' + 'custom-video-' + align

        return [
            'div',
            {
                class: 'custom-video-ctn',
            },
            [
                'div',
                {
                    class:
                        'custom-video-wrapper custom-video-wrapper-' +
                        size +
                        ' ' +
                        'custom-video-wrapper-' +
                        align,
                },
                ['iframe', mergeAttributes(this.options.HTMLAttributes, HTMLAttributes)],
            ],
        ]
    },

    addCommands(): Object {
        return {
            setExternalVideo:
                (options) =>
                ({ commands }) => {
                    return commands.insertContent({
                        type: this.name,
                        attrs: options,
                    })
                },
            deleteExternalVideo:
                () =>
                ({ commands }) => {
                    return commands.deleteSelection()
                },
            setSize:
                (attributes) =>
                ({ tr, dispatch }) => {
                    // Check it's a valid size option
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

            setAlign:
                (attributes) =>
                ({ tr, dispatch }) => {
                    // Check it's a valid size option
                    if (!this.options.aligns.includes(attributes.align)) {
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
})
