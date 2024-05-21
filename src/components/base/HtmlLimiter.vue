<template>
    <div ref="outer" class="outer" :class="{ computing: computing }" :style="style">
        <Component :is="'vue:' + tag" ref="inner" class="inner" v-html="croppedHtml"></Component>
    </div>
</template>
<script>
import debounce from 'lodash.debounce'

const _timer = 0 // set this to some thing like 1000 for visual debugging

/*
USAGE: this component must be placed in a flex container
*/
export default {
    name: 'HtmlLimiter',

    emits: ['computing', 'computed'],

    props: {
        html: {
            // the html content
            type: String,
            default: '',
        },
        tag: {
            // wrapper tag (for semantic if H1, H2...)
            type: String,
            default: 'div',
        },
        ellipsis: {
            // to be continued marker
            type: String,
            default: '...',
        },
        stripedTags: {
            // list of tags to be removed from the DOM
            type: Array,
            default: () => [],
        },
    },

    data() {
        return {
            computing: true,
            croppedHtml: this.html,
            style: {},
            // limit recalculation on resize
            debouncedCompute: debounce(this.compute, 200, { leading: false, trailing: true }),
        }
    },

    mounted() {
        this.compute()
        window.addEventListener('resize', this.debouncedCompute)
    },

    unmounted() {
        window.removeEventListener('resize', this.debouncedCompute)
    },

    methods: {
        async unblock() {
            return new Promise((resolve) => setTimeout(resolve, _timer))
        },

        filterTags(root) {
            // recursively remove unwanted tags
            if (root.nodeType == Node.ELEMENT_NODE) {
                for (let tag of this.stripedTags) {
                    if (root.tagName.toLowerCase() == tag.toLowerCase()) {
                        root.remove()
                        return
                    }
                }
            }
            const children = Array.from(root.childNodes)
            for (const child of children) this.filterTags(child)
        },

        async compute() {
            await this.unblock()
            this.style = { 'flex-basis': 'auto' }
            this.$emit('computing')
            this.computing = true
            this.croppedHtml = this.html
            this.$refs.inner.innerHTML = this.croppedHtml
            await this.unblock()
            // filter unwanted tags
            await this.filterTags(this.$refs.inner)
            await this.unblock()
            const outer = this.$refs.outer.getBoundingClientRect()
            let inner = this.$refs.inner.getBoundingClientRect()
            // if content dont overflow, keep it as it is
            if (inner.height <= outer.height) {
                this.croppedHtml = this.html
            } else {
                // trim it untill it fit
                await this.unblock()
                // tidy up html
                this.$refs.inner.normalize()
                // iterate over the first level of children in reverse order
                // for a quick tril
                const firstLevel = Array.from(this.$refs.inner.childNodes).reverse()
                // track if we have remaing (shortened) overlaping element
                // so we know if we need to add an ellipsis or it had already been added
                let noOverlap = true
                let overlapKeeped = true
                for (const node of firstLevel) {
                    if (node instanceof HTMLElement) {
                        const bbox = node.getBoundingClientRect()
                        if (bbox.top > outer.bottom) {
                            // if element is completely out of container, remove it
                            node.remove()
                        } else if (bbox.bottom > outer.bottom) {
                            // if element is overlapping process it and its children
                            noOverlap = false
                            overlapKeeped = overlapKeeped && !(await this.traverseNode(node, outer))
                        }
                    } else if (node.nodeType == Node.TEXT_NODE) {
                        // clean text nodes so they dont mislead us when adding the ellipsis at the end
                        node.nodeValue = node.nodeValue.trim()
                        if (node.nodeValue.length == 0) {
                            node.remove()
                        }
                    }
                }

                if (noOverlap || !overlapKeeped) {
                    // if there was no overlaping element or they were all removed
                    // we dont have added the ellipsis yet
                    // so add it to last node if we can
                    // or append it
                    const children = this.$refs.inner.childNodes
                    const lastNode = children.length
                        ? children[children.length - 1]
                        : this.$refs.inner
                    // tags that dont support text child
                    let tagsWithoutTextChild = [
                        'area',
                        'base',
                        'br',
                        'col',
                        'embed',
                        'hr',
                        'img',
                        'input',
                        'link',
                        'meta',
                        'source',
                        'track',
                        'wbr',
                        'video',
                        'table',
                        'ul',
                        'ol',
                    ]
                    // add ellipsis where we can
                    if (
                        lastNode.nodeType == Node.ELEMENT_NODE &&
                        !tagsWithoutTextChild.includes(lastNode.tagName.toLowerCase())
                    ) {
                        lastNode.appendChild(document.createTextNode(this.ellipsis))
                    } else {
                        this.$refs.inner.appendChild(document.createTextNode(this.ellipsis))
                    }
                }

                // updated with result
                this.croppedHtml = this.$refs.inner.innerHTML

                // recompute bounding box for next iteration
                inner = this.$refs.inner.getBoundingClientRect()
            }
            // use the computed height
            this.style = {
                'flex-basis': `${inner.height}px`,
            }
            this.computing = false
            // inform parent component of the new height
            this.$emit('computed', { height: inner.height, croppedHtml: this.croppedHtml })
        },

        async traverseNode(root, outer) {
            let rootRemoved = false
            // depth first backwrad async dom tree iteration
            const children = Array.from(root.childNodes).reverse()
            for (const child of children) await this.traverseNode(child, outer)
            // all children processed, process tree
            if (root.nodeType == Node.TEXT_NODE) {
                // if it is a text node
                // trim it until it fit
                // or remove it
                const range = document.createRange()
                range.selectNode(root)
                let bbox = range.getBoundingClientRect()
                let ellipsisAdded = false
                // iterate until element is not overlaping
                while (bbox.bottom > outer.bottom) {
                    if (bbox.height == 0) break
                    // non overlaping space size
                    const availableHeight = outer.bottom - bbox.top
                    // ratio of text to cut so it rougly fit
                    const ratio = availableHeight / bbox.height
                    let text = root.nodeValue
                    // remove ellipsis if they were added before
                    if (ellipsisAdded) text = text.substring(0, text.length - this.ellipsis.length)
                    // rough cut
                    const limit = Math.floor(text.length * ratio)
                    let shorterText = text.substring(0, limit).trim()
                    // don't cut words in the middle
                    const limitClean = shorterText.lastIndexOf(' ')
                    if (limitClean > -1) {
                        shorterText = text.substring(0, limitClean).trim()
                    } else if (ratio < 1) {
                        // if we have just one word and it dont fi
                        // empty content
                        shorterText = ''
                    }
                    // add ellipsis if there's still some text to display
                    if (shorterText.length > 0) {
                        ellipsisAdded = true
                        shorterText += this.ellipsis
                    }
                    // update node content
                    root.nodeValue = shorterText
                    await this.unblock()
                    // recompute bbox
                    range.selectNode(root)
                    bbox = range.getBoundingClientRect()
                }
                range.detach()
                // remove node if it is empty
                if (root.nodeValue == '') {
                    rootRemoved = true
                    root.remove()
                }
            } else if (root.nodeType == Node.ELEMENT_NODE) {
                // remove empty node
                // (if it is a node with no children (img...) and it is overlapping we dont keep it anyway)
                if (root.childNodes.length == 0) {
                    rootRemoved = true
                    root.remove()
                }
            }
            return rootRemoved
        },
    },

    watch: {
        // recompute if content has changer
        html(neo, old) {
            if (neo != old) this.compute()
        },
    },
}
</script>

<style lang="scss" scoped>
.outer {
    position: relative;
    flex-shrink: 0;
    overflow: hidden;

    .inner {
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        padding: 0;
        margin: 0;
    }

    &.computing {
        flex: 1 1 100%;
        overflow: visible;

        .inner {
            opacity: 0; // set to something like .3 for visual debugging
        }
    }
}
</style>
