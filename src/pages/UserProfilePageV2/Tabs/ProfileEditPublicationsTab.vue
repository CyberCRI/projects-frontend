<template>
  <div class="profile-publications">
    <div>
      <h4 class="title">
        {{ title }}
      </h4>
    </div>
    <div class="publications-warning">
      <SvgWarning class="inline-block" />
      {{ t('profile.edit.publications.no-editable') }}
    </div>
  </div>
</template>

<script setup>
/*
    publications editions not form projects
    need to add iframe to show sovisioplus
*/
import SvgWarning from '@/assets/svg/warning.svg'

defineOptions({
  name: 'ProfileEditPublicationsTab',
})
const { t } = useNuxtI18n()
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
