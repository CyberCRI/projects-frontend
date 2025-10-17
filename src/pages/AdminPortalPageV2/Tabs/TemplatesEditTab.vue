<template>
  <LayoutTab>
    <FetchLoader :status="status">
      <TemplateForm v-model="form" :errors="errors" :save-image-callback="saveImageTemplate" />
      <div class="form-actions">
        <LpiButton :label="capitalize(t('common.cancel'))" @click="redirect" />
        <LpiButton :disabled="!isValid" :label="capitalize(t('common.save'))" @click="submit" />
      </div>
    </FetchLoader>
  </LayoutTab>
</template>

<script setup>
import { capitalize } from 'es-toolkit'
import useNuxtI18n from '@/composables/useNuxtI18n'
import LayoutTab from '@/components/admin/LayoutTab.vue'
import { getTemplate, patchTemplate, postTemplateImage } from '@/api/templates.service'
import { useFormTemplate } from '@/services/template'
import TemplateForm from '@/components/templates/TemplateForm.vue'
import FetchLoader from '@/components/base/FetchLoader.vue'

defineOptions({ name: 'TemplatesEditTab' })

const { t } = useNuxtI18n()
const route = useRoute()
const router = useRouter()
const organizationCode = useOrganizationCode()
const templateId = route.params.id
const { data: template, status } = getTemplate(organizationCode, templateId)
const { form, errors, isValid, cleanedData } = useFormTemplate()

// assing fetching templates to localform
watch(
  template,
  () => {
    form.value = { ...form.value, ...template.value }
  },
  { immediate: true }
)

const submit = () => {
  patchTemplate(organizationCode, templateId, cleanedData.value)
    .then(() => redirect())
    .catch(console.error)
}
const redirect = () => router.push({ name: 'templatesList' })
const saveImageTemplate = (file) => postTemplateImage(organizationCode, templateId, file)
</script>

<style lang="scss">
.form-actions {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 0.5rem;
}
</style>
