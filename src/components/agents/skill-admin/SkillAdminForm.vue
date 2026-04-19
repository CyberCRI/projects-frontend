<script setup>
import useUsersStore from '@/stores/useUsers'
import useToasterStore from '@/stores/useToaster'

const { t } = useNuxtI18n()

const props = defineProps({
  isOpened: {
    type: Boolean,
    required: true,
  },
  skill: { type: [Object, null], required: true },
})

const isEdit = computed(() => !!props.skill)

const emit = defineEmits(['close', 'entity-created', 'entity-updated'])

const toaster = useToasterStore()
const usersStore = useUsersStore()
const defaultForm = (skill) => ({
  title: skill?.title ?? '',
  description: skill?.description ?? '',
  content: skill?.skillContents?.length ? skill.skillContents[0].content : '',
})

const form = ref(defaultForm())

const titleExists = ref(false)

watch(
  () => props.isOpened,
  async () => {
    isAsyncing.value = true
    try {
      form.value = defaultForm(props.skill)
    } catch (e) {
      console.error(e)
    } finally {
      isAsyncing.value = false
    }
  }
)

const isAsyncing = ref(false)

const close = () => emit('close')

const submit = async () => {
  isAsyncing.value = true

  let headers = {}
  const accessToken = usersStore.accessToken // localStorage?.getItem('ACCESS_TOKEN')
  if (accessToken) headers = { Authorization: `Bearer ${accessToken}` }

  try {
    if (isEdit.value) {
      await $fetch(`/api/skill/${props.skill.id}`, {
        method: 'put',
        body: form.value,
        headers,
      })
    } else {
      await $fetch('/api/skill/', { method: 'post', body: form.value, headers })
    }

    toaster.pushSuccess(
      t(isEdit.value ? 'agent-skills.edit-success' : 'agent-skills.create-success')
    )
    emit(isEdit.value ? 'entity-updated' : 'entity-created')
  } catch (e) {
    toaster.pushError(
      t(isEdit.value ? 'agent-skills.edit-error' : 'agent-skills.create-error') + ' ' + e.toString()
    )
  } finally {
    isAsyncing.value = false
    close()
  }
}
</script>
<template>
  <BaseDrawer
    data-test="vector-store-add-prompt-drawer"
    :confirm-action-name="$t('common.confirm')"
    :confirm-action-disabled="!form.title"
    :is-opened="isOpened"
    :title="$t(isEdit ? 'agent-skills.edit-skill' : 'agent-skills.create-skill')"
    class="medium"
    :asyncing="isAsyncing"
    @close="close"
    @confirm="submit"
  >
    <div class="form-section">
      <TextInput
        v-model.trim="form.title"
        :label="$t('agent-skills.title')"
        :disabled="isEdit"
        @change="titleExists = false"
      />
      <p v-if="titleExists" class="error">{{ $t('agent-skills.title-exists') }}</p>
    </div>
    <div class="form-section">
      <TextInput
        v-model.trim="form.description"
        input-type="textarea"
        :label="$t('agent-skills.description')"
        @change="titleExists = false"
      />
    </div>
    <div class="form-section">
      <TextInput
        v-model.trim="form.content"
        input-type="textarea"
        :label="$t('agent-skills.content')"
        @change="titleExists = false"
      />
    </div>
  </BaseDrawer>
</template>
<style lang="scss" scoped>
.error {
  color: $salmon;
}

.form-section ~ .form-section {
  margin-top: 1rem;
}
</style>
