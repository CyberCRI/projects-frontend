export const clickOutside = {
    beforeMount: (el, binding) => {
        const clickEventHandler = (event) => {
            if (!el.contains(event.target) && el !== event.target) {
                binding.value(event)
            }
        }
        el.__vueClickEventHandler__ = clickEventHandler
        document.addEventListener('click', clickEventHandler)
    },

    unmounted: (el: any) => {
        document.removeEventListener('click', el.__vueClickEventHandler__)
    },
}

export const disableFocus = {
    beforeMount: (el) => {
        const oldTabindex = el.getAttribute('tabindex')
        if (oldTabindex) el.setAttribute('data-oldtabindex', oldTabindex)
    },
    updated: (el, binding) => {
        if (binding.value) {
            el.tabIndex = -1
        } else {
            const oldTabindex = el.getAttribute('data-oldtabindex')
            if (oldTabindex) {
                el.tabIndex = parseInt(oldTabindex)
            } else {
                el.tabIndex = ''
            }
        }
    },
}
