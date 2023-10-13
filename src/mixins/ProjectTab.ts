import funct from '@/functs/functions'

function scrollToTab() {
    funct.scrollTo(document.querySelector('.tabs-wrapper'))
}

export default {
    beforeRouteEnter(to, _from, next) {
        let cb = (_: any /* eslint-disable-line @typescript-eslint/no-unused-vars */) => {}
        const hash = to.hash
        if (hash && hash === '#tab') {
            cb = (vm) => vm.$nextTick(scrollToTab)
        }
        next(cb)
    },
}
