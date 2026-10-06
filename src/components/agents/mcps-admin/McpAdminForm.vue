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
  authHeader: mcp?.authHeader ?? null,
  // TODO:
  // command: mcp?.command ?? '',
  // args: mcp?.args ?? '',
})

const oldApiKey = ref('')
const oldApiKeyDeleted = ref(false)
const newApiKey = ref('')
const editApiKey = () => {
  oldApiKeyDeleted.value = true
}
const cancelEditApiKey = () => {
  oldApiKeyDeleted.value = false
  newApiKey.value = ''
}

const form = ref(defaultForm())

const rules = computed(() => ({
  title: {
    required: helpers.withMessage(t('agent-mcps.form.title-required'), required),
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
      oldApiKey.value = props.mcp?.apiKeyLast4 || ''
      oldApiKeyDeleted.value = false
      newApiKey.value = ''
    } catch (e) {
      console.error(e)
    } finally {
      isAsyncing.value = false
    }
  }
)

const transportOptions = ref([
  { label: 'SSE', value: 'sse', dataTest: 'transport-option-sse' },
  { label: 'HTTP', value: 'http', dataTest: 'transport-option-http' },
  // TODO: ?
  //{ label: 'StdIo', value: 'stdio', dataTest: 'transort-option-stdio' },
])

const authHeaderOptions = ref([
  { label: 'Bearer', value: 'bearer', dataTest: 'auth-header-option-bearer' },
  { label: 'x-api-key', value: 'xapi', dataTest: 'auth-header-option-xapi' },
])

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

  let apiKey = undefined
  if (oldApiKeyDeleted.value) apiKey = ''
  if (newApiKey.value) apiKey = newApiKey.value
  try {
    const body = {
      ...form.value,
      description: html2md(form.value.description),
      apiKey,
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

const testConfigResult = ref(null)
const isTestingConfig = ref(false)

const testResulttBox = useTemplateRef('test-result')

const testConfig = async () => {
  const body = {
    id: props.mcp?.id || undefined,
    url: form.value.url,
    transport: form.value.transport,
    apiKey: newApiKey.value || undefined,
  }
  let headers = {}
  const accessToken = usersStore.accessToken // localStorage?.getItem('ACCESS_TOKEN')
  if (accessToken) headers = { Authorization: `Bearer ${accessToken}` }
  isTestingConfig.value = true
  testConfigResult.value = null
  try {
    testConfigResult.value = await $fetch('/api/test-mcp-config', {
      method: 'post',
      body,
      headers,
    })
    console.log(testConfigResult.value)
    nextTick(() => testResulttBox.value?.scrollIntoView({ behavior: 'smooth', block: 'center' }))
  } catch (err) {
    console.error(err)
  } finally {
    isTestingConfig.value = false
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
      />
    </div>
    <div class="form-section">
      <TextInput v-model.trim="form.url" :label="$t('agent-mcps.url')" @blur="v$.url.$validate" />
      <FieldErrors :errors="v$.url.$errors" />
    </div>
    <div class="form-section">
      <Field :label="$t('agent-mcps.transport')" required :errors="v$.transport.$errors">
        <LpiSelect
          v-model="form.transport"
          :options="transportOptions"
          @change="v$.transport.$validate"
        />
      </Field>
    </div>
    authHeaderOptions
    <div class="form-section">
      <Field :label="$t('agent-mcps.auth-header')">
        <LpiSelect v-model="form.authHeader" :options="authHeaderOptions" />
      </Field>
    </div>
    <div class="form-section">
      <Field :label="$t('agent-mcps.api-key')">
        <div class="apikey-field">
          <TextInput v-if="oldApiKey && !oldApiKeyDeleted" :model-value="oldApiKey" disabled />
          <LpiButton
            v-if="oldApiKey && !oldApiKeyDeleted"
            btn-icon="TrashCanOutline"
            @click="editApiKey"
          />
          <TextInput
            v-if="!oldApiKey || oldApiKeyDeleted"
            v-model="newApiKey"
            input-type="password"
          />
          <LpiButton
            v-if="oldApiKey && oldApiKeyDeleted"
            btn-icon="arrowGoBackLine"
            @click="cancelEditApiKey"
          />
        </div>
      </Field>
    </div>
    <div class="form-section test-config">
      <LpiButton
        secondary
        :diabled="isTestingConfig"
        :label="$t('agent-mcps.test-config.button')"
        :btn-icon="isTestingConfig ? 'LoaderSimple' : 'Flask'"
        @click="testConfig"
      />
    </div>
    <div v-if="testConfigResult" ref="test-result" class="form-section test-result">
      <p v-if="testConfigResult.ok" class="test-result success">
        {{ $t('agent-mcps.test-config.success') }}
      </p>
      <p v-if="!testConfigResult.ok" class="test-result fail">
        {{ $t('agent-mcps.test-config.fail') }}:
        <br />
        {{ testConfigResult.error }}
      </p>
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

.test-config {
  display: flex;
  justify-content: center;
}

.test-result {
  padding: 1rem;

  &.success {
    background-color: variables.$primary-light;
  }

  &.fail {
    background-color: variables.$salmon;
  }
}

.apikey-field {
  display: flex;
  width: 100%;
  flex-flow: row nowrap;
  gap: 1rem;
  align-items: flex-end;

  > *:first-child {
    flex-grow: 1;
  }
}
</style>
