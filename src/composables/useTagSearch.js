import { computed, watch, ref } from 'vue'
import useOrganizationsStore from '@/stores/useOrganizations'
import {
<<<<<<< HEAD
    getAllOrgClassifications,
=======
>>>>>>> fix: use new tag api for skill and refacto tag search to composable
    getOrgClassificationTags,
    getOrgClassificationAutocomplete,
} from '@/api/tag-classification.service'
import debounce from 'lodash.debounce'
<<<<<<< HEAD
export default function useTagSearch({
    useSkills,
    useProjects,
    hideOrganizationTags,
    classificationType,
}) {
    const organizationsStore = useOrganizationsStore()

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
=======
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
        return [
            {
                label: 'suggested tags',
                value: null,
            },
            ...orgClassifications.value.map((c) => ({
                label: c.slug, // TODO: need a title field
>>>>>>> fix: use new tag api for skill and refacto tag search to composable
                value: c.id,
            })),
        ]
    })

<<<<<<< HEAD
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
=======
    const organizationTags = computed(() => {
        return hideOrganizationTags ? [] : organizationsStore.current.tags
    })

    const showTagSearch = computed(() => {
        return selectedClassificatonId.value !== null && !suggestedTags.value.length // wiki and esco return no results
>>>>>>> fix: use new tag api for skill and refacto tag search to composable
    })

    // methods
    async function loadSelectedClassificationTags() {
<<<<<<< HEAD
        if (!selectedClassificationId.value) {
=======
        if (!selectedClassificatonId.value) {
>>>>>>> fix: use new tag api for skill and refacto tag search to composable
            suggestedTags.value = organizationTags.value
        } else {
            suggestedTagsisLoading.value = true

            const classificationReq = await getOrgClassificationTags(
                organizationsStore.current.code,
<<<<<<< HEAD
                selectedClassificationId.value,
=======
                selectedClassificatonId.value,
>>>>>>> fix: use new tag api for skill and refacto tag search to composable
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
<<<<<<< HEAD
                selectedClassificationId.value,
=======
                selectedClassificatonId.value,
>>>>>>> fix: use new tag api for skill and refacto tag search to composable
                { search: search.value }
            )
        } catch (e) {
            console.error(e)
        }
    }, 100)

    // watch

<<<<<<< HEAD
    watch(selectedClassificationId, loadSelectedClassificationTags, { immediate: true })

    const resetTagSearch = () => {
        search.value = ''
        selectedClassificationId.value = defaultClassificationId()
    }

    return {
        suggestedTagsisLoading,
        selectedClassificationId,
        selectedClassification,
=======
    watch(selectedClassificatonId, loadSelectedClassificationTags, { immediate: true })

    return {
        suggestedTagsisLoading,
        selectedClassificatonId,
>>>>>>> fix: use new tag api for skill and refacto tag search to composable
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
<<<<<<< HEAD
        resetTagSearch,
        allOrgClassifications,
        isLoadingOrgClassifications,
        fetchAllClassifications,
=======
>>>>>>> fix: use new tag api for skill and refacto tag search to composable
    }
}
