import funct from '@/functs/functions'
import { defineComponent } from 'vue'
function scrollToTab() {
    funct.scrollTo(document.querySelector('.tabs-wrapper'))
}

export default defineComponent({
    beforeRouteEnter(to, _from, next) {
        let cb = (_: any /* eslint-disable-line @typescript-eslint/no-unused-vars */) => {}
        const hash = to.hash
        if (hash && hash === '#tab') {
            cb = (vm) => vm.$nextTick(scrollToTab)
        }
        next(cb)
    },
})
