<script setup>
import useUsersStore from '@/stores/useUsers'
import useToasterStore from '@/stores/useToaster'

const { t } = useNuxtI18n()
const modelStrings = ref([
  'openai:gpt-4o-mini',
  'openai:gpt-4o',
  'openai:gpt-5-nano',
  'openai:gpt-5-mini',
  'openai:gpt-5',
  'openai:gpt-5.4-nano',
  'openai:gpt-5.4-mini',
  'openai:gpt-5.4',
])
const props = defineProps({
  isOpened: {
    type: Boolean,
    required: true,
  },
  agent: { type: [Object, null], required: true },
})
const emit = defineEmits(['close', 'entity-created', 'entity-updated'])

const isEdit = computed(() => !!props.agent)
const toaster = useToasterStore()
const usersStore = useUsersStore()
const defaultForm = (agent = null) => ({
  title: agent?.title ?? '',
  description: agent?.description ?? '',
  isEnabled: agent?.isEnabled ?? false,
  modelName: agent?.modelName ?? '',
  modelTemperature: agent?.modelTemperature ?? '',
  promptId: agent?.promptId ?? 0,
  promptVersion: agent?.promptVersion ?? 0,
  skillContents:
    agent?.skillsContents?.map(({ skillId, skillVersion, useLatestSkillVersion }) => ({
      skillId,
      skillVersion,
      useLatestSkillVersion,
    })) ?? [],
  documents:
    agent?.documents?.map(({ documentTitle, vectorStoreKey }) => ({
      documentTitle,
      vectorStoreKey,
    })) ?? [],
  useLatestPromptVersion: agent?.useLatestPromptVersion ?? true,
  useProfileData: agent?.useProfileData ?? false,
})

const form = ref(defaultForm())

const titleExists = ref(false)

const prompts = ref([])
const skills = ref([])
const skillOptions = ref([])

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

const fetchSkills = async () => {
  let headers = {}
  const accessToken = usersStore.accessToken // localStorage?.getItem('ACCESS_TOKEN')
  if (accessToken) headers = { Authorization: `Bearer ${accessToken}` }

  const skills = await $fetch(`/api/skill/`, {
    headers,
  })
  // if (!response.ok) {
  //   let errorText = ''
  //   try {
  //     errorText = await response.text()
  //   } catch {
  //     // ignore text parsing errors
  //   }
  //   throw new Error(
  //     errorText || `Request to /api/agent/${props.agent.id} failed with status ${response.status}`
  //   )
  // }
  return skills.map((s) => ({
    ...s,
    skillContents: s.skillContents.sort((a, b) => b.version - a.version),
  }))
}

watch(
  () => [selectedPrompt.value, form.value.useLatestPromptVersion],
  () => {
    nextTick(() => (form.value.promptVersion = latestPromptVersion.value))
  }
)

const promptVersions = computed(() =>
  (selectedPrompt.value?.promptContents || []).toSorted((a, b) => b.version - a.version)
)
const latestPromptVersion = computed(() =>
  promptVersions.value?.length ? promptVersions.value[0].version : 0
)
const versionOptions = computed(() =>
  promptVersions.value?.map((v) => ({ value: v.version, label: v.version }))
)

const { fetchAll: fetchDocuments } = useVectorStore()
const documents = ref([])
const documentOptions = ref([])

const isLoading = ref(false)
watch(
  () => props.isOpened,
  async () => {
    isLoading.value = true
    try {
      prompts.value = await fetchPrompts()
      documents.value = await fetchDocuments()
      documentOptions.value = documents.value.map((document) => {
        let opt = {
          useDocument: false,
        }
        if (props.agent?.documents) {
          const original = props.agent?.documents.find(
            (d) => d.documentTitle == document.title && d.vectorStoreKey == document.vectorStoreKey
          )
          if (original) {
            opt = {
              useDocument: true,
            }
          }
        }

        return {
          document,
          model: opt,
        }
      })
      skills.value = await fetchSkills()
      skillOptions.value = skills.value.map((skill) => {
        let opt = {
          useSkill: false,
          useLatestSkillVersion: true,
          skillVersion: 0,
        }
        if (props.agent?.skillContents) {
          const original = props.agent?.skillContents.find((s) => s.skillId == skill.id)
          if (original) {
            opt = {
              useSkill: true,
              useLatestSkillVersion: original.useLatestSkillVersion,
              skillVersion: original.skillVersion,
            }
          }
        }
        return {
          skill: skill,
          model: opt,
        }
      })
      form.value = defaultForm(props.agent)
    } catch (e) {
      console.error(e)
    } finally {
      isLoading.value = false
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

  if (form.value.useLatestPromptVersion) form.value.promptVersion = latestPromptVersion.value

  form.value.skillContents = skillOptions.value
    .filter((o) => o.model.useSkill)
    .map((o) => ({
      skillId: o.skill.id,
      skillVersion: o.model.skillVersion,
      useLatestSkillVersion: o.model.useLatestSkillVersion,
    }))

  form.value.documents = documentOptions.value
    .filter((o) => o.model.useDocument)
    .map((o) => ({
      documentTitle: o.document.title,
      vectorStoreKey: o.document.vectorStoreKey,
    }))

  try {
    console.log('save', isEdit.value)
    if (isEdit.value) {
      await $fetch(`/api/agent/${props.agent.id}`, {
        method: 'put',
        body: form.value,
        headers,
      })
    } else {
      await $fetch('/api/agent/', { method: 'post', body: form.value, headers })
    }

    toaster.pushSuccess(t(isEdit.value ? 'agents.edit-success' : 'agents.create-success'))
    emit(isEdit.value ? 'entity-updated' : 'entity-created')
  } catch (e) {
    toaster.pushError(
      t(isEdit.value ? 'agents.edit-error' : 'agents.create-error') + ' ' + e.toString()
    )
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
    :title="$t(isEdit ? 'agents.edit-agent' : 'agents.create-agent')"
    class="medium"
    :asyncing="isAsyncing || isLoading"
    @close="close"
    @confirm="submit"
  >
    <div class="loader" v-if="isLoading">
      <LoaderSimple />
    </div>
    <template v-else>
      <div class="form-section">
        <TextInput
          v-model.trim="form.title"
          :label="$t('agents.title')"
          :disabled="isEdit"
          @change="titleExists = false"
        />
        <p v-if="titleExists" class="error">{{ $t('agents.title-exists') }}</p>
      </div>
      <div class="form-section">
        <lpiCheckbox v-model="form.isEnabled" :label="$t('agents.is-enabled')" />
      </div>
      <label>{{ $t('agents.description') }}</label>
      <div class="form-section">
        <TipTapEditor
          ref="tiptapEditor"
          v-model="form.description"
          class="input-field content-editor"
        />
      </div>

      <h4 class="form-section-title">{{ $t('agents.model-section') }}</h4>
      <div class="form-section">
        <datalist id="modelStrings">
          <option
            v-for="modelString in modelStrings"
            :key="modelString"
            :value="modelString"
            :label="modelString"
          />
        </datalist>
        <TextInput
          v-model.trim="form.modelName"
          :label="$t('agents.model-name')"
          suggestion-list-id="modelStrings"
        />
      </div>
      <div class="form-section">
        <TextInput v-model.trim="form.modelTemperature" :label="$t('agents.model-temperature')" />
      </div>
      <div class="form-section">
        <h4 class="form-section-title">{{ $t('agents.prompt-section') }}</h4>
        <LpiSelect
          v-model="form.promptId"
          :options="promptOptions"
          :placeholder="$t('agents.prompt-placeholder')"
        />
      </div>
      <div v-if="form.promptId" class="form-section">
        <lpiCheckbox
          v-model="form.useLatestPromptVersion"
          :label="$t('agents.use-latest-prompt-version')"
        />
      </div>
      <div
        v-if="form.promptId && !form.useLatestPromptVersion"
        class="form-section prompt-version-section"
      >
        <span class="select-label">{{ $t('agents.use-prompt-version') }}</span>
        <LpiSelect
          v-if="!form.useLatestPromptVersion"
          v-model="form.promptVersion"
          :options="versionOptions"
          :placeholder="$t('agents.prompt-version-placeholder')"
        />
      </div>

      <h4 class="form-section-title">{{ $t('agents.tools-section') }}</h4>
      <div class="form-section">
        <div class="agent-tool-picker">
          <lpiCheckbox v-model="form.useProjectsMcp" :label="$t('agents.use-project-mcp')" />
        </div>
      </div>
      <div class="form-section">
        <div class="agent-tool-picker">
          <lpiCheckbox v-model="form.useProfileData" :label="$t('agents.use-profile-data')" />
        </div>
      </div>
      <h4 class="form-section-title">{{ $t('agents.docs-section') }}</h4>
      <div class="form-section agent-documents-section">
        <AgentDocumentPicker
          v-for="opt in documentOptions"
          :key="opt.document.vectorStoreKey + '-' + opt.document.id"
          v-model="opt.model"
          :document="opt.document"
        />
      </div>
      <h4 class="form-section-title">{{ $t('agents.skills-section') }}</h4>
      <div class="form-section agent-skills-section">
        <AgentSkillPicker
          v-for="opt in skillOptions"
          :key="opt.skill.id"
          v-model="opt.model"
          :skill="opt.skill"
          ,
        />
      </div>
    </template>
  </BaseDrawer>
</template>
<style lang="scss" scoped>
.error {
  color: $salmon;
}

.form-section ~ .form-section {
  margin-top: 1rem;
}

.form-section-title {
  color: $primary-dark;
  font-size: 1.3em;
  padding-block: 1rem;
}

.select-label {
  margin-right: 1rem;
}

.prompt-version-section {
  margin-left: 2rem;
}

.agent-skills-section,
.agent-documents-section {
  display: flex;
  flex-flow: column nowrap;
  gap: 1rem;
}

.agent-tool-picker {
  border: 1px solid #ccc;
  border-radius: 4px;
  padding: 0.4rem;
}
.loader {
  margin-top: 3rem;
  margin-inline: auto;
}
</style>
