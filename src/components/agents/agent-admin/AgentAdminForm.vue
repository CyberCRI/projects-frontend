<script setup>
import useUsersStore from '@/stores/useUsers'
import useToasterStore from '@/stores/useToaster'

const { t } = useNuxtI18n()

const props = defineProps({
  isOpened: {
    type: Boolean,
    required: true,
  },
  documentTitle: { type: String, default: '' },
  isEdit: { type: Boolean, default: false },
})
const emit = defineEmits(['close', 'document-added', 'document-updated'])

const toaster = useToasterStore()
const usersStore = useUsersStore()
const defaultForm = () => ({
  title: '',
  description: '',
  promptId: 0,
  promptVersion: 0,
  useLatestPromptVersion: true,
  useProfileData: false,
})

const form = ref(defaultForm())

const titleExists = ref(false)

const prompts = ref([])

const fetchPrompts = async () => {
  let headers = {}
  const accessToken = usersStore.accessToken // localStorage?.getItem('ACCESS_TOKEN')
  if (accessToken) headers = { Authorization: `Bearer ${accessToken}` }

  const response = await fetch(`/api/prompt/`, {
    headers,
  })
  if (!response.ok) {
    let errorText = ''
    try {
      errorText = await response.text()
    } catch {
      // ignore text parsing errors
    }
    throw new Error(
      errorText || `Request to /api/agent/${props.agent.id} failed with status ${response.status}`
    )
  }
  const prompts = await response.json()
  return prompts
}

const promptOptions = computed(
  () => prompts.value?.map((p) => ({ value: p.id, label: p.title })) || []
)

const selectedPrompt = computed(() => prompts.value.find((p) => p.id == form.value.promptId))

const promptVersions = computed(() => selectedPrompt.value?.promptContents || [])
const versionOptions = computed(() =>
  promptVersions.value?.map((v) => ({ value: v.id, label: v.version }))
)

watch(
  () => props.isOpened,
  async (neo) => {
    isAsyncing.value = true
    try {
      prompts.value = await fetchPrompts()
      form.value = defaultForm()
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
    console.log('submit')
  } catch (e) {
    toaster.pushError(e.toString())
  } finally {
    isAsyncing.value = false
    close()
  }
}
</script>
<template>
  <BaseDrawer
    data-test="vector-store-add-document-drawer"
    :confirm-action-name="$t('common.confirm')"
    :confirm-action-disabled="!form.title"
    :is-opened="isOpened"
    :title="$t(props.isEdit ? 'agents.edit-agent' : 'agents.create-agent')"
    class="medium"
    :asyncing="isAsyncing"
    @close="close"
    @confirm="submit"
  >
    <div class="form-section">
      <!--
      title             String
      description       String @default("")
      orgCode           String

      promptId          Int
      promptVersion     Int
      promptContent     PromptContent @relation(fields: [promptId, promptVersion], references: [promptId, version])

      useProjectsMcp    Boolean @default(false)
      mcps              Mcp[]
      skillContents     SkillContent[]

      useProfileData    Boolean @default(false)

      useLatestPromptVersion Boolean @default(true)

      -->
      <TextInput
        v-model.trim="form.title"
        :label="$t('agents.title')"
        :disabled="isEdit"
        @change="titleExists = false"
      />
      <p v-if="titleExists" class="error">{{ $t('agents.title-exists') }}</p>
    </div>
    <div class="form-section">
      <TextInput
        v-model.trim="form.description"
        type="textarea"
        :label="$t('agents.description')"
        @change="titleExists = false"
      />
    </div>
    <div class="form-section">
      <LpiSelect
        :options="promptOptions"
        v-model="form.promptId"
        :placeholder="$t('agents.prompt-placeholder')"
      />
    </div>
    <div class="form-section" v-if="form.promptId">
      <lpiCheckbox
        :label="$t('agents.use-latest-prompt-version')"
        v-model="form.useLatestPromptVersion"
      />
      <LpiSelect
        v-if="!form.useLatestPromptVersion"
        :options="versionOptions"
        v-model="form.promptVersion"
        :placeholder="$t('agents.prompt-version-placeholder')"
      />
    </div>
    <div class="form-section">
      <lpiCheckbox :label="$t('agents.use-project-mcp')" v-model="form.useProjectsMcp" />
    </div>
    <div class="form-section">
      <lpiCheckbox :label="$t('agents.use-profile-data')" v-model="form.useProfileData" />
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
