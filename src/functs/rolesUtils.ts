export function roleIndex(user) {
    const index = user.roles?.reduce((acc, roleString) => {
        const [scope, pk, role] = roleString.split(':')
        acc[scope] = acc[scope] || {}
        acc[scope][role] = acc[scope][role] || {}
        acc[scope][role][pk] = true
    })

    return {
        hasRole: function (scope, role, pk) {
            let res = index[scope] || {}
            res = res[role] || {}
            res = res['#' + pk] || false
            return res
        },
    }
}
