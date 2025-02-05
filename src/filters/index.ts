import { defineNuxtPlugin } from '#imports'

export const capitalize = (value) => {
    if (!value) return ''
    value = value.toString()
    return value.charAt(0).toUpperCase() + value.slice(1)
}

// TODO: dead code ?
export const toLocaleDateString = (date) => new Date(date).toLocaleDateString()

export const stripTags = (str) => (str ? str.replace(/(<([^>]+)>)/gi, '') : str)

// project members can  be group or user
// group have a members_count attribute, user don't
export const isNotGroup = (groupOrUser) => groupOrUser.members_count === undefined
export const isGroup = (groupOrUser) => !isNotGroup(groupOrUser)

export default defineNuxtPlugin((nuxtApp) => {
    nuxtApp.vueApp.config.globalProperties.$filters = {
        capitalize,
        isNotGroup,
        isGroup,
    }
})
