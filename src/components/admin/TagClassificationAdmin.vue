<script setup>
import { ref, watch, watchEffect, computed, nextTick } from 'vue'
import debounce from 'lodash.debounce'
import { getOrgClassificationTags } from '@/api/tag-classification.service'
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

const organizationsStore = useOrganizationsStore()
const toaster = useToasterStore()

const emit = defineEmits(['delete-classification'])

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

const deleteTag = async () => {
    isDeletingTag.value = true
    // TODO
    await new Promise((resolve) => setTimeout(resolve, 1000))
    toaster.pushSuccess(`Tag '${tagToDelete.value.title}' deleted`)
    isDeletingTag.value = false
    tagToDelete.value = null
}

const isDeletingClassification = ref(false)
const showConfirmClassificationDelete = ref(false)

const deleteClassification = async () => {
    isDeletingClassification.value = true
    await new Promise((resolve) => setTimeout(resolve, 1000))
    emit('delete-classification', props.classification)
    isDeletingClassification.value = false
    showConfirmClassificationDelete.value = false
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
watchEffect(() => {
    if (request.value && !search.value) {
        tagCount.value = request.value.count
    }
})

const getTags = debounce(async function () {
    isLoading.value = refreshTokenGrantRequest
    try {
        //await new Promise((resolve) => setTimeout(resolve, 300 * 1000))
        request.value = await getOrgClassificationTags(
            organizationsStore.current.code,
            props.classification.id,
            { search: search.value, order_by: 'title', limit: props.pageLimit }
        ).catch(() => ({
            results: [],
            count: 0,
            current_page: 1,
            total_page: 1,
            previous: null,
            next: null,
            first: null,
            last: null,
        }))
    } catch (e) {
        console.error(e)
    } finally {
        isLoading.value = false
    }
}, 500)

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
    request.value = (await axios.get(requestedPage)).data
    isLoading.value = false
    // const el = document.querySelector('.group-user-selection .search-section')
    // if (el) el.scrollIntoView({ behavior: 'smooth' })
}

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
            <h3>{{ tagCount }} tags</h3>
            <p v-if="classification.is_enabled_for_projects">enabled for projects</p>
            <p v-if="classification.is_enabled_for_skills">enabled for skills</p>
            <p
                v-if="
                    !classification.is_enabled_for_projects && !classification.is_enabled_for_skills
                "
            >
                disabled
            </p>
        </div>
        <div class="add-tag-ctn">
            <LpiButton label="Create tag" btn-icon="Plus" @click="createTag()" />
        </div>

        <FilterSearchInput
            ref="search-input-component"
            v-model.trim="search"
            :placeholder="$t('search.search-tag')"
            class="search-input-ctn"
        />

        <table class="table">
            <thead>
                <tr>
                    <th>Tag</th>
                    <th width="*">Description</th>
                    <th width="60">Actions</th>
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
                    <td>{{ tag.title }}</td>
                    <td>{{ tag.description }}</td>
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
        />
        <EditClassification
            :classification="classification"
            :is-open="editClassificationIsOpen"
            @close="editClassificationIsOpen = false"
        />

        <ConfirmModal
            v-if="showConfirmTagDelete"
            :asyncing="isDeletingTag"
            @cancel="tagToDelete = null"
            @confirm="deleteTag"
            title="Delete tag?"
            :content="`Are you sure you want to delete the tag '${tagToDelete?.title}'?`"
        />
        <ConfirmModal
            v-if="showConfirmClassificationDelete"
            :asyncing="isDeletingClassification"
            @cancel="showConfirmClassificationDelete = null"
            @confirm="deleteClassification"
            title="Delete classification?"
            :content="`Are you sure you want to delete the classification '${classification?.title}'?`"
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

.add-tag-ctn {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 1rem;
    margin-top: 1rem;
    margin-bottom: 1rem;
}

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
