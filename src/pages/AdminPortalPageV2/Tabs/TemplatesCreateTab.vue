<template>
  <LayoutTab :title="$t('template.create')" :notice="t('template.info')">
    <TemplateForm v-model="form" :errors="errors" :save-image-callback="saveImageTemplate" />
    <div class="form-actions">
      <LpiButton
        data-test="cancel"
        :label="capitalize(t('common.cancel'))"
        :to="LOCATION_TEMPLATES"
      />
      <LpiButton
        data-test="submit"
        :disabled="!isValid"
        :label="capitalize(t('common.save'))"
        @click="submit"
      />
    </div>
  </LayoutTab>
</template>

<script setup lang="ts">
import { postTemplate, postTemplateImage } from '~/api/templates.service'

import TemplateForm from '~/components/templates/TemplateForm.vue'
import LayoutTab from '~/components/admin/LayoutTab.vue'

import useNuxtI18n from '~/composables/useNuxtI18n'

import type { RouteLocationRaw } from 'vue-router'
import { useTemplateForm } from '~/form/template'
import { capitalize } from '~/functs/string'

const { t } = useNuxtI18n()
const router = useRouter()
const organizationCode = useOrganizationCode()
const { form, errors, isValid, cleanedData } = useTemplateForm()

const LOCATION_TEMPLATES: RouteLocationRaw = { name: 'templatesList' }

const submit = () => {
  postTemplate(organizationCode, cleanedData.value)
    .then(() => router.push(LOCATION_TEMPLATES))
    .catch(console.error)
}

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
