import debounce from 'lodash.debounce'

export default {
    data() {
        return {
            viewportWidth: 0,
        }
    },

    mounted() {
        this.getWindowWidth()
        window.addEventListener('resize', debounce(this.getWindowWidth, 500))
    },

    methods: {
        getWindowWidth() {
            this.viewportWidth = window.innerWidth
        },
    },

    computed: {
        isMobile() {
            return this.viewportWidth <= 414
        },

        isTablet() {
            return this.viewportWidth > 414 && this.viewportWidth < 1024
        },

        isDesktop() {
            return this.viewportWidth > 1024
        },
    },

    unmounted() {
        window.removeEventListener('resize', () => {})
    },
}
