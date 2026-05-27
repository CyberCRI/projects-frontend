<script setup lang="ts">
import FieldErrors from '@/components/base/form/FieldErrors.vue'
import { helpers, required } from '@vuelidate/validators'
import useToasterStore from '@/stores/useToaster'
import { isHtmlNotEmpty } from '~/functs/string'
import useUsersStore from '@/stores/useUsers'
import useValidate from '@vuelidate/core'

const { html2md, md2html } = useMarkdown()

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
  content: prompt?.promptContents?.length ? md2html(prompt.promptContents[0].content) : '',
})

const form = ref(defaultForm())

const rules = computed(() => ({
  title: {
    required: helpers.withMessage(t('prompts.form.title-required'), required),
  },
  content: {
    required: helpers.withMessage(t('prompts.form.content-required'), isHtmlNotEmpty),
  },
}))

const v$ = useValidate(rules, form)

const titleExists = ref(false)

watch(
  () => props.isOpened,
  async () => {
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
  const isValid = await v$.value.$validate()
  if (!isValid) {
    toaster.pushError(t('prompts.form.invalid'))
    return
  }
  isAsyncing.value = true

  let headers = {}
  const accessToken = usersStore.accessToken // localStorage?.getItem('ACCESS_TOKEN')
  if (accessToken) headers = { Authorization: `Bearer ${accessToken}` }

  try {
    const body = { ...form.value, content: html2md(form.value.content) }
    if (isEdit.value) {
      await $fetch(`/api/prompt/${props.prompt.id}`, {
        method: 'put',
        body,
        headers,
      })
    } else {
      await $fetch('/api/prompt/', {
        method: 'post',
        body,
        headers,
      })
    }

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
        @blur="v$.title.$validate"
      />
      <FieldErrors :errors="v$.title.$errors" />
      <p v-if="titleExists" class="error">{{ $t('agents.title-exists') }}</p>
    </div>
    <div class="form-section">
      <h4>{{ $t('prompts.content') }}</h4>
      <TipTapEditor
        v-model.trim="form.content"
        class="input-field content-editor"
        mode="medium"
        @blur="v$.content.$validate"
      />
      <FieldErrors :errors="v$.content.$errors" />
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
