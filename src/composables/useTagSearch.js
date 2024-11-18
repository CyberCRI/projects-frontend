import { computed, watch, ref } from 'vue'
import useOrganizationsStore from '@/stores/useOrganizations'
import useLanguagesStore from '@/stores/useLanguages'
import {
    getAllOrgClassifications,
    getOrgClassificationTags,
    getOrgClassificationAutocomplete,
} from '@/api/tag-classification.service'
import debounce from 'lodash.debounce'
export default function useTagSearch({
    useSkills,
    useProjects,
    hideOrganizationTags,
    classificationType,
    searchAll,
}) {
    const organizationsStore = useOrganizationsStore()
    const languagesStore = useLanguagesStore()
    const allOrgClassifications = ref([])
    const isLoadingOrgClassifications = ref(false)

    const fetchAllClassifications = async () => {
        isLoadingOrgClassifications.value = true
        try {
            const res = await getAllOrgClassifications(organizationsStore.current.code)
            allOrgClassifications.value = res.results
        } catch (e) {
            console.error(e)
        } finally {
            isLoadingOrgClassifications.value = false
        }
    }

    // computed

    const orgClassifications = computed(() =>
        allOrgClassifications.value.filter(
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

    fetchAllClassifications().then(() => {
        //  TODO use org default classification
        if (!selectedClassificationId.value)
            selectedClassificationId.value = defaultClassificationId()
    })

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

    // watch(selectedClassificationId, function () {
    //     console.log('showTagSearch', showTagSearch.value)
    //     if (!selectedClassificationId.value) {
    //         console.log('resetting search')
    //         search.value = ''
    //     }
    // })

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
            if (searchAll) {
                Promise.all(
                    orgClassifications.value.map((c) =>
                        getOrgClassificationAutocomplete(organizationsStore.current.code, c.id, {
                            search: search.value,
                            language: languagesStore.current,
                        })
                    )
                ).then((res) => {
                    const maxResults = Math.max(...res.map((r) => r.length))
                    for (let i = 0; i < maxResults; i++) {
                        res.forEach((r) => {
                            if (r[i]) {
                                suggestions.value.push(r[i])
                            }
                        })
                    }
                })
            } else {
                suggestions.value = await getOrgClassificationAutocomplete(
                    organizationsStore.current.code,
                    selectedClassificationId.value,
                    { search: search.value, language: languagesStore.current }
                )
            }
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
        allOrgClassifications,
        isLoadingOrgClassifications,
        fetchAllClassifications,
    }
}
