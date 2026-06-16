<script setup>
const props = defineProps({
  fetchEntity: { type: Function, required: true },
  entityTitle: { type: String, required: true },
})
const emit = defineEmits(['close'])

const isAsyncing = ref(false)
const entity = ref(null)

const close = () => emit('close')

const load = async () => {
  try {
    isAsyncing.value = true
    entity.value = await props.fetchEntity()
  } catch (e) {
    console.log(e.toString())
    close()
  } finally {
    isAsyncing.value = false
  }
}
// no await so we dont block ui
load()
</script>
<template>
  <ConfirmModal
    :title="entityTitle"
    :asyncing="isAsyncing"
    no-second-button
    cancel-button-label="common.close"
    @cancel="close"
    @confirm="close"
  >
    <div v-if="isAsyncing" class="loader">
      <LoaderSimple />
    </div>
    <slot v-else :entity="entity" />
  </ConfirmModal>
</template>
<style lang="scss" scoped>
.loader {
  display: flex;
  justify-content: center;
  padding-top: 3rem;
}
</style>
