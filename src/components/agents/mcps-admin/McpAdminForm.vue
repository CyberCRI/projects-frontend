<script setup lang="ts">
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
  mcp: { type: [Object, null], required: true },
})

const isEdit = computed(() => !!props.mcp)

const emit = defineEmits(['close', 'entity-created', 'entity-updated'])

const toaster = useToasterStore()
const usersStore = useUsersStore()
const defaultForm = (mcp?) => ({
  title: mcp?.title ?? '',
  description: md2html(mcp?.description ?? ''),
  transport: mcp?.transport ?? '',
  url: mcp?.url ?? '',
  // TODO:
  // command: mcp?.command ?? '',
  // args: mcp?.args ?? '',
})

const form = ref(defaultForm())

const rules = computed(() => ({
  title: {
    required: helpers.withMessage(t('agent-mcps.form.title-required'), required),
  },
  description: {
    required: helpers.withMessage(t('agent-mcps.form.description-required'), requiredContent),
  },
  transport: {
    required: helpers.withMessage(t('agent-mcps.form.transport-required'), requiredContent),
  },
  url: {
    // TODO: check url
    required: helpers.withMessage(t('agent-mcps.form.url-required'), requiredContent),
  },
}))

const v$ = useValidate(rules, form)

const titleExists = ref(false)

watch(
  () => props.isOpened,
  async () => {
    isAsyncing.value = true
    try {
      form.value = defaultForm(props.mcp)
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
    }
    if (isEdit.value) {
      await $fetch(`/api/mcp/${props.mcp.id}`, {
        method: 'put',
        body,
        headers,
      })
    } else {
      await $fetch('/api/mcp/', {
        method: 'post',
        body,
        headers,
      })
    }

    toaster.pushSuccess(t(isEdit.value ? 'agent-mcps.edit-success' : 'agent-mcps.create-success'))
    emit(isEdit.value ? 'entity-updated' : 'entity-created')
  } catch (e) {
    toaster.pushError(
      t(isEdit.value ? 'agent-mcps.edit-error' : 'agent-mcps.create-error') + ' ' + e.toString()
    )
  } finally {
    isAsyncing.value = false
    close()
  }
}
</script>
<template>
  <BaseDrawer
    data-test="vector-store-add-mcp-drawer"
    :confirm-action-name="$t('common.confirm')"
    :confirm-action-disabled="!form.title"
    :is-opened="isOpened"
    :title="$t(isEdit ? 'agent-mcps.edit-mcp' : 'agent-mcps.create-mcp')"
    class="medium"
    :asyncing="isAsyncing"
    @close="close"
    @confirm="submit"
  >
    <div class="form-section">
      <TextInput
        v-model.trim="form.title"
        :label="$t('agent-mcps.title')"
        :disabled="isEdit"
        @change="titleExists = false"
        @blur="v$.title.$validate"
      />
      <FieldErrors :errors="v$.title.$errors" />
      <p v-if="titleExists" class="error">
        {{ $t('agent-mcps.title-exists') }}
      </p>
    </div>
    <div class="form-section">
      <h4>{{ $t('agent-mcps.description') }}</h4>
      <TipTapEditor
        v-model.trim="form.description"
        class="input-field content-editor"
        mode="medium"
        @blur="v$.description.$validate"
      />
      <FieldErrors :errors="v$.description.$errors" />
    </div>
    <div class="form-section">
      <TextInput v-model.trim="form.url" :label="$t('agent-mcps.title')" @blur="v$.url.$validate" />
      <FieldErrors :errors="v$.url.$errors" />
    </div>
    <div class="form-section">
      <!-- TODO: use select   sse | stdio | http -->
      <TextInput
        v-model.trim="form.transport"
        :label="$t('agent-mcps.title')"
        @blur="v$.transport.$validate"
      />
      <FieldErrors :errors="v$.transport.$errors" />
    </div>
  </BaseDrawer>
</template>
<style lang="scss" scoped>
@use '~/design/scss/variables';

.error {
  color: variables.$salmon;
}

.form-section ~ .form-section {
  margin-top: 1rem;
}
</style>
