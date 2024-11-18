<script setup>
import { ref, watch, computed, nextTick } from 'vue'
import debounce from 'lodash.debounce'
import {
    getOrgClassificationTags,
    deleteClassificationTag,
    deleteOrgClassification,
} from '@/api/tag-classification.service'
import useOrganizationsStore from '@/stores/useOrganizations.ts'
import { refreshTokenGrantRequest } from '@panva/oauth4webapi'
import FilterSearchInput from '@/components/search/Filters/FilterSearchInput.vue'
import PaginationButtons from '@/components/base/navigation/PaginationButtons.vue'
import { axios } from '@/api/api.config'
import LoaderSimple from '@/components/base/loader/LoaderSimple.vue'
import ContextActionButton from '@/components/base/button/ContextActionButton.vue'
import LpiButton from '@/components/base/button/LpiButton.vue'
import EditTagDrawer from '@/components/admin/EditTagDrawer.vue'
import EditClassification from '@/components/admin/EditClassification.vue'
import ConfirmModal from '@/components/base/modal/ConfirmModal.vue'
import useToasterStore from '@/stores/useToaster.ts'
import { useI18n } from 'vue-i18n'
import useLanguagesStore from '@/stores/useLanguages'

const { t } = useI18n()
const languagesStore = useLanguagesStore()

const organizationsStore = useOrganizationsStore()
const toaster = useToasterStore()

const emit = defineEmits([
    'classification-edited',
    'classification-created',
    'classification-deleted',
])

const props = defineProps({
    classification: { type: Object, required: true },
    pageLimit: { type: Number, default: 12 },
})

const search = ref('')
const isLoading = ref(false)
const request = ref(null)

const editTagIsOpen = ref(false)
const editedTag = ref(null)

const editClassificationIsOpen = ref(false)

const tagToDelete = ref(null)
const isDeletingTag = ref(false)
const showConfirmTagDelete = computed(() => !!tagToDelete.value)

const currentAxiosRequestConfig = ref(null)

const deleteTag = async () => {
    isDeletingTag.value = true
    try {
        await deleteClassificationTag(
            organizationsStore.current.code,
            props.classification.id,
            tagToDelete.value.id
        )
        toaster.pushSuccess(
            t('admin.classification.tag-delete.success', { tagName: tagToDelete.value.title })
        )
        reloadClassification()
    } catch (e) {
        console.error(e)
        toaster.pushError(
            t('admin.classification.tag-delete.error', { tagName: tagToDelete.value.title })
        )
    } finally {
        isDeletingTag.value = false
        tagToDelete.value = null
    }
}

const isDeletingClassification = ref(false)
const showConfirmClassificationDelete = ref(false)

const deleteClassification = async () => {
    isDeletingClassification.value = true
    try {
        await deleteOrgClassification(organizationsStore.current.code, props.classification.id)
        toaster.pushSuccess(t('admin.classification.delete-classification.success'))
        emit('classification-deleted', props.classification)
    } catch (err) {
        toaster.pushError(t('admin.classification.delete-classification.error'))
        console.log(err)
    } finally {
        isDeletingClassification.value = false
        showConfirmClassificationDelete.value = false
    }
}

const createTag = () => {
    editedTag.value = null
    editTagIsOpen.value = true
}

const editTag = (tag) => {
    editedTag.value = tag
    editTagIsOpen.value = true
}

const editClassification = () => {
    editClassificationIsOpen.value = true
}

const tableBody = ref(null)

const tagResults = computed(() => request.value?.results || [])

const tableHeightMemo = ref(0)

watch(
    () => tagResults.value,
    () => {
        nextTick(() => {
            if (tableBody.value) {
                tableHeightMemo.value = tableBody.value.clientHeight
            }
        })
    }
)

const tagCount = ref(0)
<<<<<<< HEAD
<<<<<<< HEAD
=======
>>>>>>> fix: create edit delete classifications with real api call
const fetchTagStats = async () => {
    const data = (
        await getOrgClassificationTags(organizationsStore.current.code, props.classification.id, {
            search: '',
            order_by: 'title',
            limit: 1,
        })
    ).data
    tagCount.value = data.count
}
<<<<<<< HEAD
=======
watchEffect(() => {
    if (request.value && !search.value) {
        tagCount.value = request.value.count
    }
})
>>>>>>> fix: tag classification admin and new verison of api witk skills and project tags
=======
>>>>>>> fix: create edit delete classifications with real api call

const getTags = debounce(async function () {
    isLoading.value = refreshTokenGrantRequest
    try {
        //await new Promise((resolve) => setTimeout(resolve, 300 * 1000))
<<<<<<< HEAD
<<<<<<< HEAD
        const axiosReq = await getOrgClassificationTags(
            organizationsStore.current.code,
            props.classification.id,
            { search: search.value, order_by: 'title', limit: props.pageLimit }
        )
        request.value = axiosReq.data
        currentAxiosRequestConfig.value = axiosReq.config
    } catch (e) {
        request.value = {
=======
        request.value = await getOrgClassificationTags(
            organizationsStore.current.code,
            props.classification.id,
            { search: search.value, order_by: 'title', limit: props.pageLimit }
        ).catch(() => ({
>>>>>>> fix: tag classification admin and new verison of api witk skills and project tags
=======
        const axiosReq = await getOrgClassificationTags(
            organizationsStore.current.code,
            props.classification.id,
            { search: search.value, order_by: 'title', limit: props.pageLimit }
        )
        request.value = axiosReq.data
        currentAxiosRequestConfig.value = axiosReq.config
    } catch (e) {
        request.value = {
>>>>>>> fix: create edit delete classifications with real api call
            results: [],
            count: 0,
            current_page: 1,
            total_page: 1,
            previous: null,
            next: null,
            first: null,
            last: null,
<<<<<<< HEAD
<<<<<<< HEAD
        }
=======
        }))
    } catch (e) {
>>>>>>> fix: tag classification admin and new verison of api witk skills and project tags
=======
        }
>>>>>>> fix: create edit delete classifications with real api call
        console.error(e)
    } finally {
        isLoading.value = false
    }
}, 500)

<<<<<<< HEAD
<<<<<<< HEAD
=======
>>>>>>> fix: create edit delete classifications with real api call
const reloadClassification = async () => {
    isLoading.value = true
    try {
        fetchTagStats()
        request.value = (await axios.request(currentAxiosRequestConfig.value)).data
    } catch (e) {
        console.log(e)
        // request.value = {
        //     results: [],
        //     count: 0,
        //     current_page: 1,
        //     total_page: 1,
        //     previous: null,
        //     next: null,
        //     first: null,
        //     last: null,
        // }
    }
    isLoading.value = false
}

<<<<<<< HEAD
=======
>>>>>>> fix: tag classification admin and new verison of api witk skills and project tags
=======
>>>>>>> fix: create edit delete classifications with real api call
const pagination = computed(() => {
    if (!request.value) return { total: 0 }
    return {
        currentPage: request.value.current_page,
        total: request.value.total_page,
        previous: request.value.previous,
        next: request.value.next,
        first: request.value.first,
        last: request.value.last,
    }
})

const onClickPagination = async (requestedPage) => {
    isLoading.value = true
<<<<<<< HEAD
<<<<<<< HEAD
    const axiosReq = await axios.get(requestedPage)
    request.value = axiosReq.data
    currentAxiosRequestConfig.value = axiosReq.config
=======
    request.value = (await axios.get(requestedPage)).data
>>>>>>> fix: tag classification admin and new verison of api witk skills and project tags
=======
    const axiosReq = await axios.get(requestedPage)
    request.value = axiosReq.data
    currentAxiosRequestConfig.value = axiosReq.config
>>>>>>> fix: create edit delete classifications with real api call
    isLoading.value = false
    // const el = document.querySelector('.group-user-selection .search-section')
    // if (el) el.scrollIntoView({ behavior: 'smooth' })
}

<<<<<<< HEAD
<<<<<<< HEAD
=======
>>>>>>> fix: create edit delete classifications with real api call
const onTagEdited = async () => {
    await reloadClassification()
    editTagIsOpen.value = false
}

const onClassificationCreated = async (classification) => {
    reloadClassification()
    emit('classification-created', classification)
    editClassificationIsOpen.value = false
}
const onClassificationEdited = async (classification) => {
    reloadClassification()
    emit('classification-edited', classification)
    editClassificationIsOpen.value = false
}

const tagLabel = (tag) => {
    return tag[`title_${languagesStore.current}`] || tag.title
}

const tagDescription = (tag) => {
    return tag[`description_${languagesStore.current}`] || tag.description
}

watch(() => [props.classification.value], fetchTagStats, { immediate: true })
<<<<<<< HEAD
=======
>>>>>>> fix: tag classification admin and new verison of api witk skills and project tags
=======
>>>>>>> fix: create edit delete classifications with real api call
watch(() => [props.classification.value, search.value], getTags, { immediate: true })
</script>
<template>
    <div class="classification-addmin">
        <h2 class="classification-title">
            {{ classification.title }}
            <ContextActionButton class="small" action-icon="Pen" @click="editClassification" />
            <ContextActionButton
                secondary
                class="small"
                action-icon="TrashCanOutline"
                @click="showConfirmClassificationDelete = true"
            />
        </h2>

        <div class="add-tag-ctn">
<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
=======
            <h3>{{ tagCount }} {{ t('admin.classifications.tags') }}</h3>
>>>>>>> fix: create edit delete classifications with real api call
=======
>>>>>>> fix: use and edit default org tags and skills
            <p v-if="classification.is_enabled_for_projects">
                {{ t('admin.classifications.enabled-for-projects') }}
            </p>
            <p v-if="classification.is_enabled_for_skills">
                {{ t('admin.classifications.enabled-for-skills') }}
            </p>
<<<<<<< HEAD
=======
            <h3>{{ tagCount }} tags</h3>
            <p v-if="classification.is_enabled_for_projects">enabled for projects</p>
            <p v-if="classification.is_enabled_for_skills">enabled for skills</p>
>>>>>>> fix: tag classification admin and new verison of api witk skills and project tags
=======
>>>>>>> fix: create edit delete classifications with real api call
            <p
                v-if="
                    !classification.is_enabled_for_projects && !classification.is_enabled_for_skills
                "
            >
<<<<<<< HEAD
<<<<<<< HEAD
                {{ t('admin.classifications.disabled') }}
            </p>
        </div>
        <div class="add-tag-ctn">
            <h3>{{ tagCount }} {{ t('admin.classifications.tags') }}</h3>
<<<<<<< HEAD
            <LpiButton
                :label="t('admin.classifications.create-tag')"
                btn-icon="Plus"
                @click="createTag()"
            />
        </div>

        <div class="tags-filter">
            <label class="filter-label">{{ t('admin.classifications.table.filter') }}</label>
            <FilterSearchInput
                ref="search-input-component"
                v-model.trim="search"
                :placeholder="$t('search.search-tag')"
                class="search-input-ctn"
            />
        </div>
=======
                disabled
=======
                {{ t('admin.classifications.disabled') }}
>>>>>>> fix: create edit delete classifications with real api call
            </p>
        </div>
        <div class="add-tag-ctn">
=======
>>>>>>> fix: use and edit default org tags and skills
            <LpiButton
                :label="t('admin.classifications.create-tag')"
                btn-icon="Plus"
                @click="createTag()"
            />
        </div>

<<<<<<< HEAD
        <FilterSearchInput
            ref="search-input-component"
            v-model.trim="search"
            :placeholder="$t('search.search-tag')"
            class="search-input-ctn"
        />
>>>>>>> fix: tag classification admin and new verison of api witk skills and project tags
=======
        <div class="tags-filter">
            <label class="filter-label">{{ t('admin.classifications.table.filter') }}</label>
            <FilterSearchInput
                ref="search-input-component"
                v-model.trim="search"
                :placeholder="$t('search.search-tag')"
                class="search-input-ctn"
            />
        </div>
>>>>>>> fix: use and edit default org tags and skills

        <table class="table">
            <thead>
                <tr>
<<<<<<< HEAD
<<<<<<< HEAD
                    <th>{{ t('admin.classifications.table.tag') }}</th>
                    <th width="*">{{ t('admin.classifications.table.description') }}</th>
                    <th width="60">{{ t('admin.classifications.table.actions') }}</th>
=======
                    <th>Tag</th>
                    <th width="*">Description</th>
                    <th width="60">Actions</th>
>>>>>>> fix: tag classification admin and new verison of api witk skills and project tags
=======
                    <th>{{ t('admin.classifications.table.tag') }}</th>
                    <th width="*">{{ t('admin.classifications.table.description') }}</th>
                    <th width="60">{{ t('admin.classifications.table.actions') }}</th>
>>>>>>> fix: create edit delete classifications with real api call
                </tr>
            </thead>
            <tbody ref="tableBody">
                <tr class="loader" v-if="isLoading">
                    <td colspan="3" class="loader-td">
                        <div class="loader" :style="{ minHeight: `${tableHeightMemo || 0}px` }">
                            <LoaderSimple class="loader-spinner" />
                        </div>
                    </td>
                </tr>
                <tr v-else v-for="tag in tagResults" :key="tag.id">
                    <td>{{ tagLabel(tag) }}</td>
                    <td>{{ tagDescription(tag) }}</td>
                    <td>
                        <div class="actions">
                            <ContextActionButton
                                @click="editTag(tag)"
                                class="small"
                                action-icon="Pen"
                            />
                            <ContextActionButton
                                @click="tagToDelete = tag"
                                secondary
                                class="small"
                                action-icon="TrashCanOutline"
                            />
                        </div>
                    </td>
                </tr>
            </tbody>
        </table>
        <div
            :style="{ visibility: (!isLoading && pagination.total > 1 && 'visible') || 'hidden' }"
            class="pagination-container"
        >
            <PaginationButtons
                :current="pagination.currentPage"
                :pagination="pagination"
                :total="pagination.total"
                @update-pagination="onClickPagination"
            />
        </div>
        <EditTagDrawer
            :is-open="editTagIsOpen"
            :tag="editedTag"
            :classification="classification"
            @close="editTagIsOpen = false"
<<<<<<< HEAD
<<<<<<< HEAD
            @tag-edited="onTagEdited"
=======
>>>>>>> fix: tag classification admin and new verison of api witk skills and project tags
=======
            @tag-edited="onTagEdited"
>>>>>>> fix: create edit delete classifications with real api call
        />
        <EditClassification
            :classification="classification"
            :is-open="editClassificationIsOpen"
            @close="editClassificationIsOpen = false"
<<<<<<< HEAD
<<<<<<< HEAD
            @classification-edited="onClassificationEdited"
            @classification-created="onClassificationCreated"
=======
>>>>>>> fix: tag classification admin and new verison of api witk skills and project tags
=======
            @classification-edited="onClassificationEdited"
            @classification-created="onClassificationCreated"
>>>>>>> fix: create edit delete classifications with real api call
        />

        <ConfirmModal
            v-if="showConfirmTagDelete"
            :asyncing="isDeletingTag"
            @cancel="tagToDelete = null"
            @confirm="deleteTag"
<<<<<<< HEAD
<<<<<<< HEAD
=======
>>>>>>> fix: create edit delete classifications with real api call
            :title="t('admin.classifications.tag-delete.confirm.title')"
            :content="
                t('admin.classifications.tag-delete.confirm.description', {
                    tagName: tagToDelete?.title,
                })
            "
<<<<<<< HEAD
=======
            title="Delete tag?"
            :content="`Are you sure you want to delete the tag '${tagToDelete?.title}'?`"
>>>>>>> fix: tag classification admin and new verison of api witk skills and project tags
=======
>>>>>>> fix: create edit delete classifications with real api call
        />
        <ConfirmModal
            v-if="showConfirmClassificationDelete"
            :asyncing="isDeletingClassification"
            @cancel="showConfirmClassificationDelete = null"
            @confirm="deleteClassification"
<<<<<<< HEAD
<<<<<<< HEAD
=======
>>>>>>> fix: create edit delete classifications with real api call
            :title="t('admin.classifications.delete-classification.title')"
            :content="
                t('admin.classifications.delete-classification.content', {
                    title: classification?.title,
                })
            "
<<<<<<< HEAD
=======
            title="Delete classification?"
            :content="`Are you sure you want to delete the classification '${classification?.title}'?`"
>>>>>>> fix: tag classification admin and new verison of api witk skills and project tags
=======
>>>>>>> fix: create edit delete classifications with real api call
        />
    </div>
</template>
<style lang="scss" scoped>
.classification-title {
    font-size: $font-size-l;
    margin-bottom: 1rem;
    text-align: center;
    justify-content: center;
    display: flex;
    gap: 1rem;
}

<<<<<<< HEAD
<<<<<<< HEAD
.add-tag-ctn,
.tags-filter {
=======
.add-tag-ctn {
>>>>>>> fix: tag classification admin and new verison of api witk skills and project tags
=======
.add-tag-ctn,
.tags-filter {
>>>>>>> fix: use and edit default org tags and skills
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 1rem;
    margin-top: 1rem;
    margin-bottom: 1rem;
}

<<<<<<< HEAD
<<<<<<< HEAD
=======
>>>>>>> fix: use and edit default org tags and skills
.filter-label {
    flex-shrink: 0;
    font-weight: 700;
}

<<<<<<< HEAD
=======
>>>>>>> fix: tag classification admin and new verison of api witk skills and project tags
=======
>>>>>>> fix: use and edit default org tags and skills
.pagination-container {
    display: flex;
    justify-content: center;
    margin: 1rem;
}

.table {
    width: 100%;
    border-collapse: collapse;
    table-layout: fixed;

    thead {
        border-bottom: $border-width-s solid $mid-gray;
    }

    tbody tr:nth-child(even) {
        background-color: $almost-white;
    }

    th {
        font-weight: 700;
<<<<<<< HEAD
<<<<<<< HEAD
        text-align: left;
=======
>>>>>>> fix: tag classification admin and new verison of api witk skills and project tags
=======
        text-align: left;
>>>>>>> fix: use and edit default org tags and skills
    }

    td,
    th {
        padding: $space-m;
    }

    td.loader-td {
        padding: 0;
    }

    .actions {
        display: flex;
        gap: $space-s;
    }
}

.loader {
    height: 5rem;
    position: relative;

    .loader-spinner {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
    }
}
</style>
