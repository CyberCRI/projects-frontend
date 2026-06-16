<script setup>
import FieldErrors from '@/components/base/form/FieldErrors.vue'
import { helpers, required } from '@vuelidate/validators'
import useToasterStore from '@/stores/useToaster'
import useUsersStore from '@/stores/useUsers'
import { requiredContent } from '~/form/base'
import useValidate from '@vuelidate/core'

const { html2md, md2html } = useMarkdown()
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
  description: md2html(skill?.description ?? ''),
  content: md2html(skill?.skillContents?.length ? skill.skillContents[0].content : ''),
})

const form = ref(defaultForm())

const rules = computed(() => ({
  title: {
    required: helpers.withMessage(t('agent-skills.form.title-required'), required),
  },
  content: {
    required: helpers.withMessage(t('agent-skills.form.content-required'), requiredContent),
  },
  description: {
    required: helpers.withMessage(t('agent-skills.form.description-required'), requiredContent),
  },
}))

const v$ = useValidate(rules, form)

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
  const isValid = await v$.value.$validate()
  if (!isValid) {
    toaster.pushError(t('agent-skills.form.invalid'))
    return
  }
  isAsyncing.value = true

  let headers = {}
  const accessToken = usersStore.accessToken // localStorage?.getItem('ACCESS_TOKEN')
  if (accessToken) headers = { Authorization: `Bearer ${accessToken}` }

  try {
    const body = {
      ...form.value,
      description: html2md(form.value.description),
      content: html2md(form.value.content),
    }
    if (isEdit.value) {
      await $fetch(`/api/skill/${props.skill.id}`, {
        method: 'put',
        body,
        headers,
      })
    } else {
      await $fetch('/api/skill/', {
        method: 'post',
        body,
        headers,
      })
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
        @blur="v$.title.$validate"
      />
      <FieldErrors :errors="v$.title.$errors" />
      <p v-if="titleExists" class="error">{{ $t('agent-skills.title-exists') }}</p>
    </div>
    <div class="form-section">
      <h4>{{ $t('agent-skills.description') }}</h4>
      <TipTapEditor
        v-model.trim="form.description"
        class="input-field content-editor"
        mode="medium"
        @blur="v$.description.$validate"
      />
      <FieldErrors :errors="v$.description.$errors" />
    </div>
    <div class="form-section">
      <h4>{{ $t('agent-skills.content') }}</h4>
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
