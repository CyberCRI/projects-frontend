<script setup>
const props = defineProps({ skill: { type: Object, required: true } })

const emit = defineEmits(['update:modelValue'])

const model = defineModel({ type: Object, required: true })

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
      <lpiCheckbox v-model="model.useSkill" :label="skill.title" @change="onChange" />
    </div>
    <div class="skill-version-picker">
      <div v-if="model.useSkill" class="form-section">
        <lpiCheckbox
          v-model="model.useLatestSkillVersion"
          :label="$t('agents.use-latest-skill-version')"
          @change="onChange"
        />
      </div>
      <div v-if="model.useSkill && !model.useLatestSkillVersion" class="form-section">
        <span class="select-label">{{ $t('agents.use-skill-version') }}</span>
        <LpiSelect
          v-if="!model.useLatestSkillVersion"
          v-model="model.skillVersion"
          :options="versionOptions"
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
