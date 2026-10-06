<script setup lang="ts">
import { ENABLE_TAB_TYPE_PDF, type PDFChoies } from '~/composables/useProjectToPdf'
import type { TranslatedProject } from 'shared-projects-frontend/models'
import { projectTabSkeleton } from '~/skeletons/project-tabs.skeletons'
import { getAllProjectTab } from '~/api/v2/project-tabs.service'
import { factoryPagination } from '~/skeletons/base.skeletons'
import { textIsEmpty } from '~/functs/tiptap'
import { sanitizeTabs } from '~/functs/tabs'

const props = defineProps<{
  project: TranslatedProject
}>()
const emit = defineEmits<{
  close: []
}>()

const { t, locale } = useNuxtI18n()
const toaster = useToaster()
const asyncing = ref(false)

const organizationCode = useOrganizationCode()
const {
  data: tabs,
  isLoading,
  status,
} = getAllProjectTab(
  organizationCode,
  computed(() => props.project.id),
  {
    default: () => factoryPagination(projectTabSkeleton, props.project.modules.tabs),
    uniqueKey: 'pdf',
    paginationConfig: {
      limit: 999,
    },
  }
)

const allTabs = computed(() =>
  sanitizeTabs(tabs.value, props.project.modules, locale.value)
    .map((tab) => {
      if (tab.type === 'description') {
        tab.modules.items = textIsEmpty(props.project.$t.description) ? 0 : 1
      }
      return tab
    })
    // remove not show tab and no items availible
    .filter((tab) => tab.show_tab && tab.modules.items > 0)
    .filter((tab) => ENABLE_TAB_TYPE_PDF.includes(tab.type))
)

const form = ref<PDFChoies>([])

// generate PDF
const onGeneratePDF = () => {
  asyncing.value = true

  useProjectToPdf(props.project, form.value)
    .catch((err) => {
      console.error(`Error generation pdf for project='${props.project.id}'`, err)
      toaster.pushError(t('toasts.pdf.error'))
    })
    .finally(() => {
      asyncing.value = false
      emit('close')
    })
}

watch(
  () => [allTabs.value, isLoading.value],
  () => {
    if (!isLoading.value) {
      const newForm: PDFChoies = []
      allTabs.value.forEach((tab) => {
        newForm.push({
          visibility: true,
          tab,
        })
      })
      form.value = newForm
      // if not new tabs is enabled, auto confirm generate pdf
      if (newForm.length === 0) {
        onGeneratePDF()
      }
    }
  },
  { immediate: true, deep: true }
)
</script>

<template>
  <ConfirmModal
    :asyncing="asyncing || isLoading"
    is-small
    @cancel="$emit('close')"
    @confirm="onGeneratePDF"
  >
    <FetchLoader :status="status" skeleton only-error>
      <div :class="{ 'asyncing pointer-events-none': asyncing }">
        <h3 class="description skeletons-text">
          {{ $t('pdf.choices') }}
        </h3>
        <ul class="list-options-pdf">
          <!-- hide choices if project a empty modules values -->
          <TemplateFormSection
            v-for="(info, id) in form"
            :key="id"
            v-model:visibility="info.visibility"
            :icon="info.tab.icon"
            :title="info.tab.$t.title"
            can-visibility
            :content-expandable="false"
          />
        </ul>
      </div>
    </FetchLoader>
  </ConfirmModal>
</template>

<style lang="scss" scoped>
@use '~/design/scss/variables';

.asyncing {
  opacity: 0.7;
}

.list-options-pdf {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  width: fit-content;
  margin: auto;

  li {
    flex-grow: 1;
  }
}

.description {
  text-align: center;
  font-size: 1.3rem;
  padding: 1rem;
}
</style>
