<template>
  <LayoutTab>
    <FetchLoader :status="status">
      <FormPanel
        :asyncing="asyncing"
        :confirm-action-disabled="!stateModals.isValid || stateModals.isFormEqual"
        @confirm="submit"
        @close="redirect"
      >
        <TemplateForm
          v-model="form"
          :template="templateRaw"
          :save-image-callback="saveImageTemplate"
          @is-valid="setModals('isValid', $event)"
          @is-form-equal="setModals('isFormEqual', $event)"
        />
      </FormPanel>
    </FetchLoader>
  </LayoutTab>
</template>

<script setup lang="ts">
import { patchTemplate, postTemplateImage } from 'shared-projects-frontend/apis'

import TemplateForm from '~/components/templates/TemplateForm.vue'
import FetchLoader from '~/components/base/FetchLoader.vue'
import LayoutTab from '~/components/admin/LayoutTab.vue'

import type { TemplateForm as TemplateFormType } from 'shared-projects-frontend/models'
import { getTemplate } from '~/api/v2/templates.service'
import FormPanel from '~/components/base/FormPanel.vue'
import { omit } from 'es-toolkit'

const form = ref()
const { stateModals, setModals } = useModals({
  isValid: false,
  isFormEqual: false,
})

const { t } = useNuxtI18n()
const toaster = useToaster()
const route = useRoute()
const router = useRouter()
const asyncing = ref(false)
const organizationCode = useOrganizationCode()
const templateId = computed(() => parseInt(route.params.id.toString(), 10))
const { data: template, status, refresh } = getTemplate(organizationCode, templateId)

const templateRaw = computed<TemplateFormType>(() => ({
  ...omit(template.value, ['$t']),
  project_categories_ids: [],
}))

const redirect = () => router.push({ name: 'templatesList' })

const submit = () => {
  asyncing.value = true

  patchTemplate(organizationCode, templateId.value, form.value)
    .then(() => {
      toaster.pushSuccess(t('toasts.template-update.success'))
      return refresh().then(() => redirect())
    })
    .catch((error) => {
      toaster.pushError(t('toasts.template-update.error'))
      console.log(error)
    })
    .finally(() => (asyncing.value = false))
}
const saveImageTemplate = (file) => postTemplateImage(organizationCode, templateId.value, file)
</script>

<style lang="scss">
.form-actions {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 0.5rem;
}
</style>
