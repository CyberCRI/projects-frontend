// project members can  be group or user
// group have a members_count attribute, user don't
export const isNotGroup = (groupOrUser) => groupOrUser.members_count === undefined

export const isGroup = (groupOrUser) => !isNotGroup(groupOrUser)
