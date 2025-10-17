<template>
  <LayoutTab :title="$t('template.create')" :notice="t('template.info')">
    <TemplateForm v-model="form" :errors="errors" :save-image-callback="saveImageTemplate" />
    <div class="form-actions">
      <LpiButton :label="capitalize(t('common.cancel'))" :click="redirect" />
      <LpiButton :disabled="!isValid" :label="capitalize(t('common.save'))" @click="submit" />
    </div>
  </LayoutTab>
</template>

<script setup>
import { capitalize } from 'es-toolkit'
import useNuxtI18n from '@/composables/useNuxtI18n'
import LayoutTab from '@/components/admin/LayoutTab.vue'
import { postTemplate, postTemplateImage } from '@/api/templates.service'
import { useFormTemplate } from '@/services/template'
import TemplateForm from '@/components/templates/TemplateForm.vue'

defineOptions({ name: 'TemplatesCreateTab' })

const { t } = useNuxtI18n()
const router = useRouter()
const organizationCode = useOrganizationCode()
const { data: form, errors, isValid, cleanedData } = useFormTemplate()

const submit = () => {
  postTemplate(organizationCode, templateId, cleanedData.value)
    .then(() => redirect())
    .catch(console.error)
}
const redirect = () => router.push({ name: 'templatesList' })

// we don't have the templateId (we are on creation) so we put -1
// backend have a task to check/replace image from templates
const saveImageTemplate = (file) => postTemplateImage(organizationCode, -1, file)
</script>

<style lang="scss">
.form-actions {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 0.5rem;
}
</style>
