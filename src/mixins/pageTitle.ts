import { defineComponent } from 'vue'
function getPageTitle(vm) {
    const { pageTitle } = vm.$options
    if (pageTitle) {
        return typeof pageTitle === 'function' ? pageTitle.call(vm) : pageTitle
    }
}
export default defineComponent({
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

    /* TODO broken with pinia, remove because anyway we'll switch to nuxt soon*/

    // watch: {
    //     currentLang: function () {
    //         this.setPageTitle()
    //     },
    // },
})
