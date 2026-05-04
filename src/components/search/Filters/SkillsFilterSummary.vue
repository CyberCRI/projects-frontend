<template>
  <div>
    <CurrentTags :current-tags="skills" @remove-tag="removeSkill" />
  </div>
</template>

<script setup lang="ts">
import CurrentTags from '~/components/search/FilterTags/CurrentTags.vue'

const model = defineModel<any[]>({ default: [] })
const skills = ref([])

watch(
  model,
  (neo, old) => {
    if (neo && neo !== old) {
      skills.value = [...model.value]
    }
  },
  {
    immediate: true,
    deep: true,
  }
)

const removeSkill = (skill) => {
  const skillsIndex = skills.value.findIndex(
    (element) => element.id === skill.id && element.name === skill.name
  )
  skills.value.splice(skillsIndex, 1)
  model.value = [...skills.value]
}
</script>

<style lang="scss" scoped>
.tag-search-title {
  text-align: center;
  font-size: $font-size-2xl;
  font-weight: 700;
  margin: pxToRem(46px) auto;
}

.search-input-ctn {
  margin-bottom: 24px;
}
</style>

<style lang="scss">
.input-ctn {
  width: 100%;

  label {
    align-self: flex-start;
  }

  input {
    width: 100%;
  }
}

.add-modal .s-modal-wrapper .s-modal-content {
  max-height: 526px;
}

.search-modal .s-modal-wrapper .s-modal-content {
  max-height: 660px;
}

.tag-search-label {
  font-size: $font-size-m;
  color: $primary-dark;
  font-weight: 700;
  margin: 0 0 $space-s $space-l;
}
</style>
