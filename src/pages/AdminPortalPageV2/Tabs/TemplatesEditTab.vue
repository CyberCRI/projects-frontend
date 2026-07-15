<template>
  <LayoutTab>
    <FetchLoader :status="status">
      <TemplateForm v-model="form" :errors="errors" :save-image-callback="saveImageTemplate" />
      <div class="form-actions">
        <LpiButton data-test="cancel" :label="t('common.cancel')" @click="redirect" />
        <LpiButton
          data-test="submit"
          :disabled="!isValid"
          :label="t('common.save')"
          @click="submit"
        />
      </div>
    </FetchLoader>
  </LayoutTab>
</template>

<script setup lang="ts">
import { patchTemplate, postTemplateImage } from 'shared-projects-frontend/apis'

import TemplateForm from '~/components/templates/TemplateForm.vue'
import FetchLoader from '~/components/base/FetchLoader.vue'
import LayoutTab from '~/components/admin/LayoutTab.vue'

import useNuxtI18n from '~/composables/useNuxtI18n'

import { getTemplate } from '~/api/v2/templates.service'
import { useTemplateForm } from '~/form/template'

const { t } = useNuxtI18n()
const route = useRoute()
const router = useRouter()
const organizationCode = useOrganizationCode()
const templateId = computed(() => parseInt(route.params.id.toString(), 10))
const { data: template, status } = getTemplate(organizationCode, templateId)
const { form, errors, isValid, cleanedData } = useTemplateForm()

// assing fetching templates to localform
watch(
  template,
  () => {
    form.value = { ...form.value, ...template.value }
  },
  { immediate: true }
)

const submit = () => {
  patchTemplate(organizationCode, templateId.value, cleanedData.value)
    .then(() => redirect())
    .catch(console.error)
}
const redirect = () => router.push({ name: 'templatesList' })
const saveImageTemplate = (file) => postTemplateImage(organizationCode, templateId.value, file)
</script>

<style lang="scss">
@use '~/design/scss/variables';

.form-actions {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 0.5rem;
}
</style>
