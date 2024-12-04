import { computed, watch, ref } from 'vue'
import useOrganizationsStore from '@/stores/useOrganizations'
import {
    getAllOrgClassifications,
    getOrgClassificationTags,
} from '@/api/tag-classification.service'
export default function useTagSearch({
    useSkills,
    useProjects,
    hideOrganizationTags,
    classificationType,
} = {}) {
    const organizationsStore = useOrganizationsStore()
    const allOrgClassifications = ref([])
    const isLoadingOrgClassifications = ref(false)

    const fetchAllClassifications = async (noLoading) => {
        if (!noLoading) isLoadingOrgClassifications.value = true
        try {
            const res = await getAllOrgClassifications(organizationsStore.current.code)
            allOrgClassifications.value = res.results
        } catch (e) {
            console.error(e)
        } finally {
            if (!noLoading) isLoadingOrgClassifications.value = false
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

    const suggestedTagsAreLoading = ref(false)
    const search = ref('')
    const suggestedTags = ref([]) // org pinned tags

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
            suggestedTagsAreLoading.value = true

            const classificationReq = await getOrgClassificationTags(
                organizationsStore.current.code,
                selectedClassificationId.value,
                // temp hackish fix until we have count int he org data
                { search: '' }
            )
            // if there's too many tags, show none
            // this will display the search input
            suggestedTags.value = classificationReq.count <= 20 ? classificationReq.results : []

            suggestedTagsAreLoading.value = false
        }
    }

    // watch

    watch(selectedClassificationId, loadSelectedClassificationTags, { immediate: true })

    const resetTagSearch = () => {
        search.value = ''
        selectedClassificationId.value = defaultClassificationId()
    }

    return {
        suggestedTagsAreLoading,
        selectedClassificationId,
        selectedClassification,
        search,
        suggestedTags,
        organizationsStore,
        orgClassifications,
        orgClassificationOptions,
        organizationTags,
        showTagSearch,
        loadSelectedClassificationTags,
        resetTagSearch,
        allOrgClassifications,
        isLoadingOrgClassifications,
        fetchAllClassifications,
    }
}
