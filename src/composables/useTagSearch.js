import { computed, watch, ref } from 'vue'
import useOrganizationsStore from '@/stores/useOrganizations'
import {
    getOrgClassificationTags,
    getOrgClassificationAutocomplete,
} from '@/api/tag-classification.service'
import debounce from 'lodash.debounce'
export default function useTagSearch({
    useSkills,
    useProjects,
    hideOrganizationTags,
    classificationType,
}) {
    const organizationsStore = useOrganizationsStore()

    // computed

    const orgClassifications = computed(() =>
        organizationsStore.allClassifications.filter(
            (c) =>
                (!classificationType || c.type === classificationType) &&
                (!useProjects || c.is_enabled_for_projects) &&
                (!useSkills || c.is_enabled_for_skills)
        )
    )

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
                label: c.title,
                value: c.id,
            })),
        ]
    })

    const defaultClassificationId = () =>
        (orgClassificationOptions.value.length && orgClassificationOptions.value[0].value) || null

    const selectedClassificationId = ref(defaultClassificationId())

    // data

    const suggestedTagsisLoading = ref(false)
    const search = ref('')
    const suggestedTags = ref([]) // org pinned tags
    const suggestions = ref([]) // auto complete suggest

    // computed

    const selectedClassification = computed(() => {
        return orgClassifications.value.find((c) => {
            return c.id === selectedClassificationId.value
        })
    })

    const organizationTags = computed(() => {
        const orgTags = []
        if (useSkills) {
            orgTags.push(...organizationsStore.current.default_skills_tags)
        }

        if (useProjects) {
            orgTags.push(...organizationsStore.current.default_projects_tags)
        }
        return hideOrganizationTags ? [] : orgTags
    })

    const showTagSearch = computed(() => {
        return selectedClassificationId.value !== null && !suggestedTags.value.length // wiki and esco return no results
    })

    // methods
    async function loadSelectedClassificationTags() {
        if (!selectedClassificationId.value) {
            suggestedTags.value = organizationTags.value
        } else {
            suggestedTagsisLoading.value = true

            const classificationReq = await getOrgClassificationTags(
                organizationsStore.current.code,
                selectedClassificationId.value,
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
                selectedClassificationId.value,
                { search: search.value }
            )
        } catch (e) {
            console.error(e)
        }
    }, 100)

    // watch

    watch(selectedClassificationId, loadSelectedClassificationTags, { immediate: true })

    const resetTagSearch = () => {
        search.value = ''
        selectedClassificationId.value = defaultClassificationId()
    }

    return {
        suggestedTagsisLoading,
        selectedClassificationId,
        selectedClassification,
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
        resetTagSearch,
    }
}
