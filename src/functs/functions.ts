import axios from 'axios'
import store from '@/store'

export default {
    copyObject(obj) {
        // simple way to copy object - Not perfect, to rethink.
        return JSON.parse(JSON.stringify(obj))
    },

    toHDate(d) {
        const months = [
            'Jan',
            'Feb',
            'Mar',
            'Apr',
            'May',
            'Jun',
            'Jul',
            'Aug',
            'Sep',
            'Oct',
            'Nov',
            'Dec',
        ]
        const date = new Date(d)
        const year = date.getFullYear()
        const month = months[date.getMonth()]
        const day = date.getDate()

        return day + ' ' + month + ' ' + year
    },

    toHHour(d) {
        const date = new Date(d)
        const hour = (date.getHours() < 10 ? '0' : '') + date.getHours()
        const min = (date.getMinutes() < 10 ? '0' : '') + date.getMinutes()
        return hour + ':' + min
    },

    getTimePassed(d) {
        /* https://natclark.com/tutorials/javascript-relative-time/ */

        const now = new Date().getTime()
        const old = new Date(d).getTime()
        const formatter = new Intl.RelativeTimeFormat(store.getters['languages/current'] || 'en', {
            style: `long`,
        })

        const secondsNow = Math.floor(now / 1000)
        const secondsOld = Math.floor(old / 1000)

        const difference = secondsNow - secondsOld
        let relativeTime = ''

        if (difference < 60) {
            // Less than a minute has passed:
            relativeTime = formatter.format(-difference, `seconds`)
        } else if (difference < 3600) {
            // Less than an hour has passed:
            relativeTime = formatter.format(-Math.floor(difference / 60), `minutes`)
        } else if (difference < 86400) {
            // Less than a day has passed:
            relativeTime = formatter.format(-Math.floor(difference / 3600), `hours`)
        } else if (difference < 2620800) {
            // Less than a month has passed:
            relativeTime = formatter.format(-Math.floor(difference / 86400), `days`)
        } else if (difference < 31449600) {
            // Less than a year has passed:
            relativeTime = formatter.format(-Math.floor(difference / 2620800), `months`)
        } else {
            // More than a year has passed:
            relativeTime = formatter.format(-Math.floor(difference / 31449600), `years`)
        }

        return relativeTime
    },

    fullYearDateFormat(date) {
        const today = new Date(date)
        const year = today.getFullYear()
        let month = '' + (today.getMonth() + 1)
        let day = '' + today.getDate()

        if (month.length < 2) month = '0' + month
        if (day.length < 2) day = '0' + day

        return [year, month, day].join('-')
    },

    isConnected() {
        return store.getters['users/user']
    },

    isValidMail(email) {
        // big bad regex to check mail string
        const re =
            /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
        return re.test(String(email).toLowerCase())
    },

    isValidUrl(string) {
        try {
            new URL(string)
            return true
        } catch (_) {
            return false
        }
    },

    editorCanEdit(wsData, mode) {
        // The first replace is here to check if we have an img or and iframe (video) only
        // We replace it with nothing because it doesn't matter what value it gets
        // The second replace is here to remove all the other HTML tags and only tags.
        // If the first doesn't remove anything, we will have an empty string
        // Or the tags content.
        if (mode === 'edit') {
            return (
                wsData.savedContent !== wsData.originalContent &&
                !!wsData.savedContent.replace(/<iframe|<img/gi, 'data').replace(/<[^>]+>/gi, '')
            )
        }

        return (
            !!wsData.savedContent &&
            !!wsData.savedContent.replace(/<iframe|<img/gi, 'data').replace(/<[^>]+>/gi, '')
        )
    },

    hasPermission(permissions, scope, action, pk?) {
        if (permissions[`${scope}.${action}`] && !pk) return permissions[`${scope}.${action}`]
        else if (pk) return permissions[`${scope}.${action}.${pk}`]
        return false
    },

    newSID(long = false) {
        const alphabet = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ'
        const idLength = long ? 16 : 8
        let id = ''
        for (let i = 0; i < idLength; i++) {
            id += alphabet.charAt(Math.floor(Math.random() * alphabet.length))
        }
        return id
    },

    async getPatatoidFile(patatoidNumber): Promise<File> {
        try {
            const urlFile = `${
                import.meta.env.VITE_APP_PUBLIC_BINARIES_PREFIX
            }/patatoids-project/Patatoid-${patatoidNumber}.png`
            const fileName = `patatoid-${patatoidNumber}.png`
            const result = await axios.get(urlFile, { responseType: 'blob' })
            return new File([result.data], fileName)
        } catch {
            // In case it cannot find an image return first one
            const urlFile = `${
                import.meta.env.VITE_APP_PUBLIC_BINARIES_PREFIX
            }/patatoids-project/Patatoid-1.png`
            const fileName = 'Patatoid-1.png'
            const result = await axios.get(urlFile, { responseType: 'blob' })
            return new File([result.data], fileName)
        }
    },

    isDefaultPortal(): boolean {
        return import.meta.env.VITE_APP_API_ORG_CODE === 'DEFAULT'
    },

    setTokenForWS(token) {
        document.cookie = `token=${token}; path=/; Secure; SameSite=None`
    },

    getOrgsFromRoles(roles: string[] = []): string[] {
        // Filter roles that only contains an org e.g: '/ClientsAdmin' => ko, '/projects/organizations/CRI/administrators' => ok
        const rolesWithOrg = roles.filter((role) => role.split('/').length >= 4)

        // Map org and remove duplicate
        return [...new Set(rolesWithOrg.map((role) => role.split('/')[3]))]
    },

    adaptParam(params) {
        return {
            params: Object.entries(params)
                .map((entry) => [entry[0], Array.isArray(entry[1]) ? entry[1].join(',') : entry[1]])
                .reduce((acc, cur) => {
                    const index = cur[0] as number

                    acc[index] = cur[1]

                    return acc
                }, {}),
        }
    },

    removePrefix(url) {
        const prefix = /^https?:\/\//i
        // remove any prefix
        url = url.replace(prefix, '')

        return url
    },

    isEmpty(obj) {
        return Object.keys(obj).length === 0
    },

    scrollTo(node) {
        if (!node || !node.getBoundingClientRect) return
        const nodePosition = node.getBoundingClientRect().top
        const header = document.querySelector('#APP > .header')
        const headerSize = header ? header.getBoundingClientRect().height : 0
        window.scroll({
            left: 0,
            top: window.scrollY + nodePosition - headerSize,
            behavior: 'smooth',
        })
    },

    resetScroll() {
        window.scroll(0, 0)
    },
}
