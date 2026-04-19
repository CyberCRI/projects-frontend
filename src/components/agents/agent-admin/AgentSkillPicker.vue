<script setup>
const props = defineProps({ skill: { type: Object, required: true } })

const emit = defineEmits(['update:modelValue'])

const model = defineModel()

const skillVersions = computed(() =>
  (props.skill.skillContents || []).toSorted((a, b) => b.value.version - a.value.version)
)
const latestSkillVersion = computed(() =>
  skillVersions.value?.length ? skillVersions.value[0].version : 0
)
const versionOptions = computed(() =>
  skillVersions.value?.map((v) => ({ value: v.version, label: v.version }))
)

const onChange = () => {
  const payload = { ...unref(model), skillVersion: latestSkillVersion.value }
  console.log('about to emit', payload)
  nextTick(() => emit('update:modelValue', payload))
}
</script>
<template>
  <div class="agent-skill-picker">
    <div class="form-section skill-title">
      <lpiCheckbox :label="skill.title" v-model="model.useSkill" @change="onChange" />
    </div>
    <div class="skill-version-picker">
      <div class="form-section" v-if="model.useSkill">
        <lpiCheckbox
          :label="$t('agents.use-latest-skill-version')"
          v-model="model.useLatestSkillVersion"
          @change="onChange"
        />
      </div>
      <div class="form-section" v-if="model.useSkill && !model.useLatestSkillVersion">
        <span class="select-label">{{ $t('agents.use-skill-version') }}</span>
        <LpiSelect
          v-if="!model.useLatestSkillVersion"
          :options="versionOptions"
          v-model="model.skillVersion"
          :placeholder="$t('agents.skill-version-placeholder')"
        />
      </div>
    </div>
  </div>
</template>
<style lang="scss" scoped>
.agent-skill-picker {
  border: 1px solid #ccc;
  border-radius: 4px;
  padding: 0.4rem;
}
.skill-version-picker {
  margin-top: 1rem;
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-left: 2rem;
}
.skill-title :deep(label) {
  font-weight: bold;
}
.select-label {
  margin-right: 1rem;
}
</style>
