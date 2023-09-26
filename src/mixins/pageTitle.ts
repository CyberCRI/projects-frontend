import { mapGetters } from 'vuex'

function getPageTitle(vm) {
    const { pageTitle } = vm.$options
    if (pageTitle) {
        return typeof pageTitle === 'function' ? pageTitle.call(vm) : pageTitle
    }
}
export default {
    mounted() {
        this.setPageTitle()
    },

    methods: {
        setPageTitle() {
            const pagetitle = getPageTitle(this)
            if (pagetitle) {
                document.title = 'Projects - ' + pagetitle
            } else {
                document.title = 'Projects'
            }
        },
    },

    computed: {
        ...mapGetters({
            currentLang: 'languages/current',
        }),
    },

    watch: {
        currentLang: function () {
            this.setPageTitle()
        },
    },
}
