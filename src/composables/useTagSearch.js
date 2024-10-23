import { computed, watch, ref } from 'vue'
import useOrganizationsStore from '@/stores/useOrganizations'
import {
    getOrgClassificationTags,
    getOrgClassificationAutocomplete,
} from '@/api/tag-classification.service'
import debounce from 'lodash.debounce'
export default function useTagSearch(hideOrganizationTags) {
    const organizationsStore = useOrganizationsStore()

    // data

    const suggestedTagsisLoading = ref(false)
    const selectedClassificatonId = ref(null)
    const search = ref('')
    const suggestedTags = ref([]) // org pinned tags
    const suggestions = ref([]) // auto complete suggest

    // computed

    const orgClassifications = computed(() => {
        return organizationsStore.current.enabled_tag_classifications
    })

    const orgClassificationOptions = computed(() => {
        const suggest = hideOrganizationTags
            ? []
            : [
                  {
                      label: 'suggested tags',
                      value: null,
                  },
              ]
        return [
            ...suggest,
            ...orgClassifications.value.map((c) => ({
                label: c.slug, // TODO: need a title field
                value: c.id,
            })),
        ]
    })

    const organizationTags = computed(() => {
        return hideOrganizationTags ? [] : organizationsStore.current.tags
    })

    const showTagSearch = computed(() => {
        return selectedClassificatonId.value !== null && !suggestedTags.value.length // wiki and esco return no results
    })

    // methods
    async function loadSelectedClassificationTags() {
        if (!selectedClassificatonId.value) {
            suggestedTags.value = organizationTags.value
        } else {
            suggestedTagsisLoading.value = true

            const classificationReq = await getOrgClassificationTags(
                organizationsStore.current.code,
                selectedClassificatonId.value,
                // temp hackish fix until we have count int he org data
                { search: '' }
            )
            // if there's too many tags, show none
            // this will display the search input
            suggestedTags.value = classificationReq.count <= 20 ? classificationReq.results : []

            suggestedTagsisLoading.value = false
        }
    }

    const suggest = debounce(async function (evt) {
        suggestions.value = []
        if (evt.key === 'Enter') return // dont show suggestion when triggering search
        if (!search.value || search.value.length < 3) return
        try {
            suggestions.value = await getOrgClassificationAutocomplete(
                organizationsStore.current.code,
                selectedClassificatonId.value,
                { search: search.value }
            )
        } catch (e) {
            console.error(e)
        }
    }, 100)

    // watch

    watch(selectedClassificatonId, loadSelectedClassificationTags, { immediate: true })

    return {
        suggestedTagsisLoading,
        selectedClassificatonId,
        search,
        suggestions,
        suggestedTags,
        organizationsStore,
        orgClassifications,
        orgClassificationOptions,
        organizationTags,
        showTagSearch,
        suggest,
        loadSelectedClassificationTags,
    }
}
