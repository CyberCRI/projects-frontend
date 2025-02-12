/* eslint-disable vue/no-unused-properties */
/* eslint-disable vue/require-name-property */
import { defineComponent } from 'vue'
export default defineComponent({
    methods: {
        transformStringWeight(string, firstWeight, mainWeight) {
            const splitString = string.split(' ')
            // If string has one word make its weight 'mainWeight'
            if (splitString.length === 1) return `<span class='f${mainWeight}'>${string}</span>`
            // Else make the first word's weight 'firstWeight' and the rest 'mainWeight'
            splitString[0] = `<span class='f${firstWeight}'>${splitString[0]}</span>`
            return `<span class='f${mainWeight}'>${splitString.join(' ')}</span>`
        },

        toHtmlThinBold(string) {
            return this.transformStringWeight(string, 'reg', 'bold')
        },

        toHtmlBoldThin(string) {
            return this.transformStringWeight(string, 'bold', 'reg')
        },
    },
})
