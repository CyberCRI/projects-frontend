<script setup>
const props = defineProps({ skill: { type: Object, required: true } })

const model = defineModel()

const skillVersions = computed(() =>
  (props.skill.skillContents || []).toSorted((a, b) => b.version - a.version)
)
const latestPromptVersion = computed(() =>
  skillVersions.value?.length ? skillVersions.value[0].version : 0
)
const versionOptions = computed(() =>
  skillVersions.value?.map((v) => ({ value: v.version, label: v.version }))
)
</script>
<template>
  <div class="form-section">
    <lpiCheckbox :label="skill.title" v-model="model.useSkill" />
  </div>
  <div class="form-section" v-if="model.useSkill">
    <lpiCheckbox
      :label="$t('agents.use-latest-skill-version')"
      v-model="model.useLatestSkillVersion"
    />
  </div>
  <div class="form-section" v-if="model.useSkill && !model.useLatestSkillVersion">
    <span>{{ $t('agent.use-skill-version') }}</span>
    <LpiSelect
      v-if="!model.useLatestSkillVersion"
      :options="versionOptions"
      v-model="model.skillVersion"
      :placeholder="$t('agents.skill-version-placeholder')"
    />
  </div>
</template>
