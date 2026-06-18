<script setup lang="ts">
import { ProjectModuleTitle, type TranslatedProject } from '~/models/project.model'
import { DEFAULT_PDF_OPTIONS } from '~/composables/useProjectToPdf'

const props = defineProps<{
  project: TranslatedProject
}>()
const emit = defineEmits<{
  close: []
}>()

const toaster = useToaster()
const { t } = useNuxtI18n()
const asyncing = ref(false)
const form = ref(structuredClone(DEFAULT_PDF_OPTIONS))

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

// add resources in modules (concat links/files)
const modules = computed(() => ({
  ...props.project.modules,
  resources: props.project.modules.files + props.project.modules.links,
}))
</script>

<template>
  <ConfirmModal
    :asyncing="asyncing"
    title="PDF"
    is-small
    @cancel="$emit('close')"
    @confirm="onGeneratePDF"
  >
    <div :class="{ 'asyncing pointer-events-none': asyncing }">
      <h3 class="description">
        {{ $t('pdf.choices') }}
      </h3>
      <ul class="list-options-pdf">
        <template v-for="(value, name) in form">
          <!-- hide choices if project a empty modules values -->
          <li v-if="modules[name] > 0" :key="name">
            <LpiCheckbox v-model="form[name]" :label="$t(ProjectModuleTitle[name], 10)" as-button />
          </li>
        </template>
      </ul>
    </div>
  </ConfirmModal>
</template>

<style lang="scss" scoped>
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
