<template>
  <div class="layout-tab">
    <h2 v-if="title" class="title">
      {{ title }}
    </h2>
    <div class="header">
      <div v-if="notice" class="notices" v-html="notice" />
      <div v-if="$slots.actions" class="actions">
        <slot name="actions" />
      </div>
    </div>
    <div class="layout-container">
      <slot />
    </div>
  </div>
</template>

<script setup lang="ts">
withDefaults(
  defineProps<{
    notice?: string
    title?: string
  }>(),
  {
    notice: null,
    title: null,
  }
)
</script>

<style lang="scss" scoped>
@use '~/design/scss/variables';

.layout-tab {
  .title {
    font-style: normal;
    font-weight: 700;
    font-size: calc(var(--font-base-scale, 1) * 2.625rem);
    line-height: 1.2;
    text-align: center;
    margin-bottom: 1.25rem;
  }

  .header {
    display: flex;
    align-items: end;
    gap: variables.$space-2xl;

    .notices:not(:only-child) {
      flex-basis: 75%;
    }

    .notices {
      p + p {
        margin-top: variables.$space-m;
      }
    }

    .actions {
      flex-basis: 25%;
      display: flex;
      justify-content: flex-end;
    }
  }

  > button {
    margin: 0 auto variables.$space-l;
  }

  svg {
    width: 24px;
    fill: variables.$white;
  }

  .icon-tip {
    width: 1.2em;
    height: 1.2em;
    display: inline-block;
    vertical-align: bottom;
    fill: variables.$primary-dark;
  }
}

.layout-container {
  margin: 0 auto;
  padding: variables.$space-m;
}

@media screen and (max-width: variables.$min-desktop) {
  .header {
    flex-direction: column;
  }
}
</style>
