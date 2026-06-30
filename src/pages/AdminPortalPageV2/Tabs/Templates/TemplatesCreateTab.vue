<template>
  <LayoutTab>
    <FormPanel
      :asyncing="asyncing"
      :confirm-action-disabled="!stateModals.isValid || stateModals.isFormEqual"
      @confirm="submit"
      @close="redirect"
    >
      <TemplateForm
        v-model="cleanedData"
        :save-image-callback="saveImageTemplate"
        @is-valid="setModals('isValid', $event)"
        @is-form-equal="setModals('isFormEqual', $event)"
      />
    </FormPanel>
  </LayoutTab>
</template>

<script setup lang="ts">
import { postTemplate, postTemplateImage } from '~/api/templates.service'

import TemplateForm from '~/components/templates/TemplateForm.vue'
import LayoutTab from '~/components/admin/LayoutTab.vue'

import FormPanel from '~/components/base/FormPanel.vue'

const cleanedData = ref()
const { stateModals, setModals } = useModals({
  isValid: false,
  isFormEqual: false,
})

const toaster = useToaster()
const router = useRouter()
const asyncing = ref(false)
const organizationCode = useOrganizationCode()
const global = useGlobals()

const redirect = () => router.push({ name: 'templatesList' })
const submit = () => {
  asyncing.value = true
  postTemplate(organizationCode, cleanedData.value)
    .then(() => {
      toaster.pushSuccess('toasts.template-create.success')
      global.hasUnsavedEdit = false
      return redirect()
    })
    .catch((error) => {
      toaster.pushError('toasts.template-create.error')
      console.log(error)
    })
    .finally(() => (asyncing.value = false))
}
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
