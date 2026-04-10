<script setup>
const { t } = useNuxtI18n()
const props = defineProps({
  isOpened: { type: Boolean, required: true },
  isEdit: { type: Boolean, default: false },
  isAsyncing: { type: Boolean, default: false },
  isValid: { type: Boolean, required: true },
  saveEntity: { type: Function, required: true },
})
const emit = defineEmits(['close', 'entity-added', 'entity-updated'])

const toaster = useToasterStore()
const titleExists = ref(false)

const isSaving = ref(false)

const close = () => emit('close')

const submit = async () => {
  isSaving.value = true
  try {
    await saveEntity({ isEdit })
    if (props.isEdit) emit('entity-updated')
    else emit('entity-added')
  } catch (e) {
    console.error(e)
  } finally {
    isSaving.value = false
    close()
  }
}
</script>
<template>
  <BaseDrawer
    data-test="vector-store-add-document-drawer"
    :confirm-action-name="t('common.confirm')"
    :confirm-action-disabled="!title || !file"
    :is-opened="isOpened"
    :title="t(props.isEdit ? 'vector-store.edit-document' : 'vector-store.add-document')"
    class="medium"
    :asyncing="isAsyncing || isSaving"
    @close="close"
    @confirm="submit"
  >
    <slot :entity="entity" />
  </BaseDrawer>
</template>
<style lang="scss" scoped>
.error {
  color: $salmon;
}
</style>
