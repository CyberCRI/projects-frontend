export const capitalize = (value) => {
    if (!value) return ''
    value = value.toString()
    return value.charAt(0).toUpperCase() + value.slice(1)
}

export const toLocaleDateString = (date) => new Date(date).toLocaleDateString()

export const stripTags = (str) => (str ? str.replace(/(<([^>]+)>)/gi, '') : str)

// project members can  be group or user
// group have a type attribute, user don't
export const isNotGroup = (groupOrUser) => !groupOrUser.type
export const isGroup = (groupOrUser) => !isNotGroup(groupOrUser)
