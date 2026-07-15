<template>
  <section class="profile-edit-block">
    <h2 v-if="blockTitle" class="section-title">
      {{ blockTitle }}
    </h2>
    <slot />
  </section>
</template>

<script setup lang="ts">
withDefaults(
  defineProps<{
    blockTitle?: string
  }>(),
  {
    blockTitle: '',
  }
)
</script>

<style lang="scss" scoped>
@use '~/design/scss/variables';

.profile-edit-block {
  padding: variables.pxToRem(43px) variables.pxToRem(63px);
  border-radius: variables.pxToRem(21px);
  border: variables.$border-width-m solid variables.$lighter-gray;
}

.section-title {
  font-size: variables.$font-size-2xl;
  font-weight: 700;
  margin-bottom: 41px;
}
</style>
