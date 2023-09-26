import funct from '@/functs/functions'

function scrollToTab() {
    funct.scrollTo(document.querySelector('.tabs-wrapper'))
}

export default {
    beforeRouteEnter(to, _from, next) {
        let cb = (_vm) => {}
        const hash = to.hash
        if (hash && hash === '#tab') {
            cb = (vm) => vm.$nextTick(scrollToTab)
        }
        next(cb)
    },
}
