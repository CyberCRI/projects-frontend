import { defineComponent } from 'vue'
export const projectInitialScroll = defineComponent({
    computed: {
        blogEntrySpecificUrl() {
            return this.$route.name === 'projectblog' && this.$route.query.b
        },
    },

    mounted() {
        // Don't launch initial scroll if user requests a specific blog-entry url
        if (!this.blogEntrySpecificUrl) {
            // If content (#scrollview) has been scrolled below the project's header, scroll up until the bottom of project's header
            this.$nextTick(() => {
                const scrollview = document.getElementById('scrollview')
                const scrollViewTop = scrollview ? scrollview.scrollTop : 0
                const container = document.querySelector('.z-header > .container')
                const projectHeaderHeight = container ? container.scrollHeight : 0
                if (scrollViewTop > projectHeaderHeight) {
                    if (scrollview) scrollview.scrollTop = projectHeaderHeight
                }
            })
        }
    },
})

export const parallaxScrolling = defineComponent({
    data() {
        return {
            scrollState: 'full',
        }
    },

    mounted() {
        this.setPerspectiveAndFixedElements('on')
        const scrollView = document.getElementById('scrollview')
        if (scrollView) scrollView.addEventListener('scroll', this.scrollListener)
    },

    beforeUnmount() {
        this.setPerspectiveAndFixedElements('off-perspective')
        document.getElementById('scrollview').removeEventListener('scroll', this.scrollListener)
    },

    methods: {
        setPerspectiveAndFixedElements(mode) {
            // Identify required HTML elements
            const scrollView = document.getElementById('scrollview')
            const perspectiveCont: HTMLElement = document.querySelector(
                '#project-page .perspective_cont'
            )
            const firstWithTitle: HTMLElement = document.querySelector('.project .withtitle')
            const allWithTitle = document.querySelectorAll('.project .withtitle')
            const titlebar: HTMLElement = document.querySelector('.project .titlebar')
            const firstTitleBarContainer: HTMLElement = document.querySelector(
                '.project .title-bar-cont'
            )
            const allTitleBarCont = document.querySelectorAll('.project .title-bar-cont')

            // Set scrollWidth
            const scrollWidth = scrollView.clientWidth - scrollView.offsetWidth

            // Set values to HTML elements according to mode type
            if (mode === 'on') {
                scrollView.style.perspective = '100px'
                scrollView.style['transform-style'] = 'preserve-3d'
                if (perspectiveCont) {
                    perspectiveCont.style.transform = 'translateZ(-75px) scale(1.749)'
                }
                if (firstWithTitle) {
                    firstWithTitle.style.display = 'none'
                }
                if (titlebar) {
                    titlebar.style.position = 'absolute'
                    titlebar.style.top = '0'
                }
                if (firstTitleBarContainer) {
                    firstTitleBarContainer.style.position = 'static'
                    firstTitleBarContainer.style.top = '0'
                    firstTitleBarContainer.style.marginTop = '0'
                    firstTitleBarContainer.style.marginBottom = '0'
                    firstTitleBarContainer.style.width = 'initial'
                }
                this.scrollState = 'full'
            } else if (mode === 'off') {
                // sticky don't work on gecko with perspective
                if (navigator.userAgent.includes('Gecko')) {
                    if (perspectiveCont) {
                        perspectiveCont.style.transform = 'initial'
                        perspectiveCont.style.width = `calc(${scrollWidth}px + 100vw)`
                    }
                    scrollView.style.perspective = 'none'
                    scrollView.style['transform-style'] = 'flat'
                }
                ;[].forEach.call(allWithTitle, (el) => (el.style.display = 'block'))
                ;[].forEach.call(allTitleBarCont, (el) => {
                    el.style.position = 'sticky'
                    el.style['z-index'] = 11
                    el.style.top = 0
                    el.style.marginTop = '-100px'
                    el.style.marginBottom = '100px'
                    el.style.width = `calc(${scrollWidth}px + 100vw)`
                })
                this.scrollState = 'mini'
            } else if (mode === 'off-perspective') {
                if (perspectiveCont) {
                    perspectiveCont.style.transform = 'initial'
                }
                scrollView.style.perspective = 'none'
                scrollView.style['transform-style'] = 'flat'
            }
        },

        scrollListener() {
            const scrollTop = document.getElementById('scrollview').scrollTop

            const boundingRect = document
                .querySelector('.project .titlebarghost')
                .getBoundingClientRect()

            // TODO: explicit the 418 value
            const tos = {
                top: boundingRect.top + window.scrollY + 418,
                left: boundingRect.left + window.scrollX,
            }

            if (scrollTop <= tos.top && this.scrollState !== 'full') {
                requestAnimationFrame(() => {
                    this.setPerspectiveAndFixedElements('on')
                })
            } else if (scrollTop > tos.top && this.scrollState !== 'mini') {
                requestAnimationFrame(() => {
                    this.setPerspectiveAndFixedElements('off')
                })
            }
        },
    },
})
