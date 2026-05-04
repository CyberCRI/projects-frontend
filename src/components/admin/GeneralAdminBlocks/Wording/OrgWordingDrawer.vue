<template>
  <BaseDrawer
    :confirm-action-name="$t('common.save')"
    :confirm-action-disabled="asyncing"
    :is-opened="isOpened"
    :title="$t('admin.portal.general.wording.title')"
    class="wording-drawer medium"
    @close="close"
    @confirm="saveWording"
  >
    <div class="field-section title-section">
      <TextInput
        v-model="form.dashboard_title"
        :label="$t('admin.portal.general.wording.fields.title')"
        :placeholder="$t('admin.portal.general.wording.fields.title-placeholder')"
        class="input-field"
      />
    </div>

    <div class="field-section editor-section">
      <h4 class="field-label">
        {{ $t('admin.portal.general.wording.fields.description') }}
      </h4>
      <TipTapEditor
        ref="tiptapEditor"
        v-model="form.description"
        :save-image-callback="saveOrganizationImage"
        class="input-field content-editor"
        mode="full"
        @image="handleImage"
      />
    </div>
  </BaseDrawer>
</template>

<script setup lang="ts">
import { patchOrganization, postOrganizationImage } from '~/api/organizations.service'

import TipTapEditor from '~/components/base/form/TextEditor/TipTapEditor.vue'
import TextInput from '~/components/base/form/TextInput.vue'
import BaseDrawer from '~/components/base/BaseDrawer.vue'

import useOrganizationsStore from '~/stores/useOrganizations'
import useToasterStore from '~/stores/useToaster'
import { NULL_CONTENT } from '~/functs/constants'

const props = withDefaults(defineProps<{ isOpened?: boolean }>(), { isOpened: false })

const emit = defineEmits<{
  close: []
  'organization-edited': []
}>()

const { t } = useNuxtI18n()
const toaster = useToasterStore()
const organizationsStore = useOrganizationsStore()

const form = ref({
  dashboard_title: '',
  description: '',
})
const addedImages = ref([])
const asyncing = ref(false)
const organization = computed(() => organizationsStore.current)
const organizationCode = useOrganizationCode()

watch(
  () => props.isOpened,
  () => {
    // reset form
    form.value.dashboard_title = organization.value?.dashboard_title || ''
    form.value.description = organization.value?.description || NULL_CONTENT
  },
  {
    immediate: true,
  }
)

const saveOrganizationImage = (file) => {
  const formData = new FormData()
  formData.append('file', file, file.name)
  return postOrganizationImage({
    orgCode: organizationCode,
    body: formData,
  })
}

const saveWording = async () => {
  asyncing.value = true

  try {
    const payload = {
      ...form.value,
    }

    await patchOrganization(organizationCode, payload)
    emit('organization-edited')
    toaster.pushSuccess(t('admin.portal.general.wording.success'))
  } catch (err) {
    toaster.pushError(`${t('admin.portal.general.wording.error')} (${err})`)
    console.error(err)
  } finally {
    asyncing.value = false
    emit('close')
  }
}

const close = () => emit('close')

// TODO see BlogDrawer
const handleImage = (img) => addedImages.value.push(img.id)
</script>
<style lang="scss" scoped>
.field-section {
  display: flex;
  flex-direction: column;
}

.title-section {
  flex-shrink: 0;
}

.editor-section {
  flex-grow: 1;
  overflow: hidden;
}

.field-label {
  font-size: $font-size-s;
  margin-top: $space-l;
  margin-bottom: $space-m;
}
</style>
