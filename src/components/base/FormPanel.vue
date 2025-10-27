<template>
  <div>
    <div class="form-panel" data-test="form-panel-layout-container">
      <main ref="main" :style="customStyle" class="drawer__main custom-scrollbar">
        <slot />
      </main>

      <footer v-if="!noFooter" class="form-panel-footer">
        <slot name="footer">
          <LpiButton
            :disabled="asyncing"
            :label="t('common.cancel')"
            secondary
            class="footer__left-button"
            data-test="close-button"
            @click="close"
          />

          <LpiButton
            :disabled="confirmActionDisabled || asyncing"
            :label="confirmActionName || t('common.confirm')"
            :btn-icon="asyncing ? 'LoaderSimple' : null"
            class="footer__right-button"
            data-test="confirm-button"
            @click="confirm"
          />
        </slot>
      </footer>
    </div>
  </div>
</template>

<script setup>
defineOptions({ name: 'FormPanel' })

const { t } = useNuxtI18n()

defineProps({
  confirmActionName: {
    type: String,
    default: null,
  },

  noFooter: {
    type: Boolean,
    default: false,
  },

  customStyle: {
    type: Object,
    default: () => {},
  },

  confirmActionDisabled: {
    type: Boolean,
    default: false,
  },

  asyncing: {
    type: Boolean,
    deafault: false,
  },
})

const emit = defineEmits(['close', 'confirm'])

const close = () => emit('close')
const confirm = () => emit('confirm')
</script>

<style lang="scss" scoped>
.form-panel {
  display: flex;
  flex-direction: column;

  .form-panel-footer {
    width: 100%;
    display: flex;
    justify-content: center;
    border-top: $border-width-s solid $lighter-gray;
    color: $primary-dark;
    font-weight: 700;
    padding-top: $space-l;
    padding-bottom: $space-l;
    background: $white;
    gap: $space-l;

    button ~ button {
      text-transform: capitalize;
    }
  }
}
</style>
