<template>
  <span class="ai-warning">
    <IconImage class="logo" name="AiGenerate2" />
    <span class="label">AI-GENERATED</span>
  </span>
</template>
<script lang="ts" setup></script>
<style lang="scss" scoped>
@use '~/design/scss/variables';

.ai-warning {
  display: flex;
  gap: 0.6rem;
  width: max-content;
  align-items: center;
  font-size: 0.8rem;

  .logo {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 1.4em;
    aspect-ratio: 1;
    padding: 0.2em;
    background-color: variables.$blue;
    border-radius: 100%;
  }

  .label {
    font-weight: 500;
  }
}
</style>
