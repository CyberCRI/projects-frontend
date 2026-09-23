<script setup lang="ts"></script>
<template>
  <div class="unmodified-form-warning">
    <IconImage class="icon" name="QuestionMark" />
    <p>{{ $t('form.is-unmodified') }}</p>
  </div>
</template>
<style scoped lang="scss">
@use '~/design/scss/variables';

.unmodified-form-warning {
  display: flex;
  gap: 1rem;
  padding: 0.8rem;
  color: variables.$salmon;
  border: 1px solid currentcolor;
  align-items: center;
  justify-content: center;
  border-radius: 0.4em;
  font-weight: bold;

  .icon {
    fill: currentcolor;
    flex-basis: 1.2em;
  }
}
</style>
