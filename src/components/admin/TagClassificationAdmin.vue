<script setup>
import { ref, watch, computed, nextTick } from 'vue'
import { debounce } from 'es-toolkit'
import { getOrgClassificationTags, deleteClassificationTag } from '@/api/tag-classification.service'
import useOrganizationsStore from '@/stores/useOrganizations.ts'
import FilterSearchInput from '@/components/search/Filters/FilterSearchInput.vue'
import PaginationButtons from '@/components/base/navigation/PaginationButtons.vue'
import useAPI from '@/composables/useAPI.ts'
import LoaderSimple from '@/components/base/loader/LoaderSimple.vue'
import LpiButton from '@/components/base/button/LpiButton.vue'
import EditTagModal from '@/components/admin/EditTagModal.vue'
import ConfirmModal from '@/components/base/modal/ConfirmModal.vue'
import useToasterStore from '@/stores/useToaster.ts'
import { useI18n } from 'vue-i18n'
import useTagTexts from '@/composables/useTagTexts.js'

import ContextActionButton from '@/components/base/button/ContextActionButton.vue'

const { t } = useI18n()

const organizationsStore = useOrganizationsStore()
const toaster = useToasterStore()
const tagTexts = useTagTexts()

const props = defineProps({
  classification: { type: Object, required: true },
  pageLimit: { type: Number, default: 12 },
})

const search = ref('')
const isLoading = ref(false)
const request = ref(null)

const editTagIsOpen = ref(false)
const editedTag = ref(null)

const tagToDelete = ref(null)
const isDeletingTag = ref(false)
const showConfirmTagDelete = computed(() => !!tagToDelete.value)

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

const createTag = () => {
  editedTag.value = null
  editTagIsOpen.value = true
}

const editTag = (tag) => {
  editedTag.value = tag
  editTagIsOpen.value = true
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
const fetchTagStats = async () => {
  const data = await getOrgClassificationTags(
    organizationsStore.current.code,
    props.classification.id,
    {
      search: '',
      order_by: 'title',
      limit: 1,
    }
  )
  tagCount.value = data.count
}

const getTags = debounce(async function () {
  isLoading.value = true
  try {
    const apiReq = await getOrgClassificationTags(
      organizationsStore.current.code,
      props.classification.id,
      { search: search.value, ordering: 'title', limit: props.pageLimit }
    )
    request.value = apiReq
  } catch (e) {
    request.value = {
      results: [],
      count: 0,
      current_page: 1,
      total_page: 1,
      previous: null,
      next: null,
      first: null,
      last: null,
    }
    console.error(e)
  } finally {
    isLoading.value = false
  }
}, 500)

const reloadClassification = async () => {
  isLoading.value = true
  try {
    fetchTagStats()
    await Promise.all([getTags(), fetchTagStats()])
  } catch (e) {
    console.log(e)
  }
  isLoading.value = false
}

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
  const tagResults = await useAPI(requestedPage, {})
  request.value = tagResults
  isLoading.value = false
  // const el = document.querySelector('.group-user-selection .search-section')
  // if (el) el.scrollIntoView({ behavior: 'smooth' })
}

const onTagEdited = async () => {
  await reloadClassification()
  editTagIsOpen.value = false
}

watch(() => [props.classification.value], fetchTagStats, { immediate: true })
watch(() => [props.classification.value, search.value], getTags, { immediate: true })
</script>
<template>
  <div class="classification-addmin">
    <div class="add-tag-ctn">
      <h3>{{ tagCount }} {{ t('admin.classifications.tags') }}</h3>
      <LpiButton
        :label="t('admin.classifications.create-tag')"
        btn-icon="Plus"
        @click="createTag()"
      />
    </div>

    <div v-show="tagResults?.length > 7" class="tags-filter">
      <label class="filter-label">{{ t('admin.classifications.table.filter') }}</label>
      <FilterSearchInput
        ref="search-input-component"
        v-model.trim="search"
        :placeholder="$t('search.search-tag')"
        class="search-input-ctn"
      />
    </div>

    <table class="table">
      <thead>
        <tr>
          <th>{{ t('admin.classifications.table.tag') }}</th>
          <th width="*">
            {{ t('admin.classifications.table.description') }}
          </th>
          <th width="60">
            {{ t('admin.classifications.table.actions') }}
          </th>
        </tr>
      </thead>
      <tbody ref="tableBody">
        <tr v-if="isLoading" class="loader">
          <td colspan="3" class="loader-td">
            <div class="loader" :style="{ minHeight: `${tableHeightMemo || 0}px` }">
              <LoaderSimple class="loader-spinner" />
            </div>
          </td>
        </tr>
        <tr v-for="tag in tagResults" v-else :key="tag.id" data-test="tag-entry">
          <td>
            <strong>{{ tagTexts.title(tag) }}</strong>
          </td>
          <td>{{ tagTexts.description(tag) }}</td>
          <td>
            <div class="actions">
              <ContextActionButton
                class="small"
                action-icon="Pen"
                data-test="edit-tag-button"
                @click="editTag(tag)"
              />
              <ContextActionButton
                secondary
                class="small"
                action-icon="TrashCanOutline"
                data-test="delete-tag-button"
                @click="tagToDelete = tag"
              />
            </div>
          </td>
        </tr>
      </tbody>
    </table>
    <div
      v-if="pagination.total > 1"
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
    <EditTagModal
      data-test="edit-tag-modal"
      :is-open="editTagIsOpen"
      :tag="editedTag"
      :classification="classification"
      @close="editTagIsOpen = false"
      @tag-edited="onTagEdited"
    />

    <ConfirmModal
      v-if="showConfirmTagDelete"
      data-test="confirm-tag-delete-modal"
      :asyncing="isDeletingTag"
      :title="t('admin.classifications.tag-delete.confirm.title')"
      :content="
        t('admin.classifications.tag-delete.confirm.description', {
          tagName: tagToDelete?.title,
        })
      "
      @cancel="tagToDelete = null"
      @confirm="deleteTag"
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

.add-tag-ctn,
.tags-filter {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1rem;
  margin-top: 1rem;
  margin-bottom: 1rem;
}

.filter-label {
  flex-shrink: 0;
  font-weight: 700;
}

.pagination-container {
  display: flex;
  justify-content: center;
  margin: 1rem;
}

strong {
  font-weight: bold;
}

.table {
  width: 100%;
  border-collapse: collapse;
  table-layout: fixed;

  thead,
  tbody tr {
    border-bottom: $border-width-s solid $mid-gray;
  }

  th {
    font-weight: 700;
    text-align: left;
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
