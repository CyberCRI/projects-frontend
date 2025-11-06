<template>
  <div class="profile-publications">
    <div>
      <h4 class="title">
        {{ title }}
      </h4>
    </div>
    <div class="publications-warning">
      <SvgWarning class="inline-block" />
      {{ notEditable }}
    </div>
  </div>
</template>

<script setup>
/*
    publications editions not form projects
    need to add iframe to show sovisuplus
*/
import SvgWarning from '@/assets/svg/warning.svg'

defineOptions({
  name: 'ResearcherEditDocumentsTab',
})
const { t } = useNuxtI18n()

const props = defineProps({
  docType: String,
})

const title = computed(() => t(`me.${props.docType}`))
const notEditable = computed(() => t(`profile.edit.${props.docType}.no-editable`))
</script>

<style lang="scss">
.publications-warning {
  border-radius: 20px;
  padding: 1rem;
  background-color: $salmon;
  color: rgba(0 0 0 / 80%);
  font-style: italic;
}

.inline-block {
  display: inline-block;
}
</style>
