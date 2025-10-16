<template>
  <div class="layout-tab">
    <div class="header">
      <div v-if="notice" class="notices">
        <LpiSnackbar border icon="QuestionMark" type="info" class="snackbar">
          <div v-html="notice" />
        </LpiSnackbar>
      </div>
      <div v-if="$slots.actions" class="actions">
        <slot name="actions" />
      </div>
    </div>
    <div class="layout-container">
      <slot />
    </div>
  </div>
</template>

<script setup>
defineOptions({ name: 'LayoutTab' })

defineProps({
  notice: {
    type: String,
    default: null,
  },
})
</script>

<style lang="scss" scoped>
.layout-tab {
  .header {
    display: flex;
    align-items: end;
    gap: $space-2xl;

    .notices {
      // flex-basis: 75%;

      p + p {
        margin-top: $space-m;
      }
    }

    .actions {
      flex-basis: 25%;
      display: flex;
      justify-content: flex-end;
    }
  }

  > button {
    margin: 0 auto $space-l;
  }

  svg {
    width: 24px;
    fill: $white;
  }

  .icon-tip {
    width: 1.2em;
    height: 1.2em;
    display: inline-block;
    vertical-align: bottom;
    fill: $primary-dark;
  }
}

.layout-container {
  margin: 0 auto;
  padding: $space-m;
}

@media screen and (max-width: $min-desktop) {
  .header {
    flex-direction: column;
  }
}
</style>
