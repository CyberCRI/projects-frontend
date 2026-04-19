<script setup>
import useUsersStore from '@/stores/useUsers'
import useToasterStore from '@/stores/useToaster'

const { t } = useNuxtI18n()

const props = defineProps({
  isOpened: {
    type: Boolean,
    required: true,
  },
  prompt: { type: [Object, null], required: true },
})

const isEdit = computed(() => !!props.prompt)

const emit = defineEmits(['close', 'entity-created', 'entity-updated'])

const toaster = useToasterStore()
const usersStore = useUsersStore()
const defaultForm = (prompt) => ({
  title: prompt?.title ?? '',
  content: prompt?.promptContents?.length ? prompt.promptContents[0].content : '',
})

const form = ref(defaultForm())

const titleExists = ref(false)

watch(
  () => props.isOpened,
  async (neo) => {
    isAsyncing.value = true
    try {
      form.value = defaultForm(props.prompt)
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
      const { data } = await $fetch(`/api/prompt/${props.prompt.id}`, {
        method: 'put',
        body: form.value,
        headers,
      })
    } else {
      const { data } = await $fetch('/api/prompt/', { method: 'post', body: form.value, headers })
    }
    // if (!response.ok) {
    //   let errorText = ''
    //   try {
    //     errorText = await response.text()
    //   } finally {
    //     throw new Error(errorText || `Post to /api/prompt/ failed with status ${response.status}`)
    //   }
    // }
    toaster.pushSuccess(t(isEdit.value ? 'prompts.edit-success' : 'prompts.create-success'))
    emit(isEdit.value ? 'entity-updated' : 'entity-created')
  } catch (e) {
    toaster.pushError(
      t(isEdit.value ? 'prompts.edit-error' : 'prompts.create-error') + ' ' + e.toString()
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
    :title="$t(isEdit ? 'prompts.edit-prompt' : 'prompts.create-prompt')"
    class="medium"
    :asyncing="isAsyncing"
    @close="close"
    @confirm="submit"
  >
    <div class="form-section">
      <TextInput
        v-model.trim="form.title"
        :label="$t('prompts.title')"
        :disabled="isEdit"
        @change="titleExists = false"
      />
      <p v-if="titleExists" class="error">{{ $t('agents.title-exists') }}</p>
    </div>
    <div class="form-section">
      <TextInput
        v-model.trim="form.content"
        input-type="textarea"
        :label="$t('prompts.content')"
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
