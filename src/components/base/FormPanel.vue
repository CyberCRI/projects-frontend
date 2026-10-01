<template>
  <div>
    <div class="form-panel" data-test="form-panel-layout-container">
      <main ref="main" :style="customStyle" class="drawer__main custom-scrollbar">
        <slot />
      </main>

      <footer v-if="!noFooter" class="form-panel-footer">
        <Transition name="fade">
          <UnmodifiedFormWarning v-if="showUnmodifiedWarning" />
        </Transition>
        <div class="form-panel-actions">
          <slot name="footer">
            <LpiButton
              v-if="showCancel"
              :disabled="asyncing"
              :label="t('common.cancel')"
              secondary
              class="footer__left-button skeletons-background"
              data-test="close-button"
              @click="close"
            />

            <slot name="footer-extra" />

            <LpiButton
              :disabled="confirmActionDisabled || asyncing"
              :label="confirmActionName || t('common.confirm')"
              :btn-icon="asyncing ? 'LoaderSimple' : null"
              class="footer__right-button skeletons-background"
              data-test="confirm-button"
              @click="confirm"
            />
          </slot>
        </div>
      </footer>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { StyleValue } from 'vue'

const { t } = useNuxtI18n()

const props = withDefaults(
  defineProps<{
    confirmActionName?: string
    noFooter?: boolean
    customStyle?: StyleValue
    confirmActionDisabled?: boolean
    isFormEqual?: boolean
    asyncing?: boolean
    showCancel?: boolean
  }>(),
  {
    confirmActionName: null,
    noFooter: false,
    customStyle: () => ({}),
    confirmActionDisabled: false,
    asyncing: false,
    showCancel: true,
  }
)

const showUnmodifiedWarning = ref(false)
const hideUnmodifiedWarningTimeout = ref(null)
const emit = defineEmits<{
  close: []
  confirm: []
}>()

const close = () => emit('close')
const confirm = () => {
  if (props.isFormEqual) {
    showUnmodifiedWarning.value = true
    hideUnmodifiedWarningTimeout.value = setTimeout(() => {
      showUnmodifiedWarning.value = false
      hideUnmodifiedWarningTimeout.value = null
    }, 10_000)
    return
  }
  emit('confirm')
}

onBeforeUnmount(() => {
  if (hideUnmodifiedWarningTimeout.value) clearTimeout(hideUnmodifiedWarningTimeout.value)
})
</script>

<style lang="scss" scoped>
@use '~/design/scss/variables';

.form-panel {
  display: flex;
  flex-direction: column;

  .form-panel-footer {
    width: 100%;
    display: flex;
    flex-flow: column nowrap;
    border-top: variables.$border-width-s solid variables.$lighter-gray;
    color: variables.$primary-dark;
    padding-top: variables.$space-l;
    padding-bottom: variables.$space-l;
    background: variables.$white;
    gap: variables.$space-l;
  }

  .form-panel-actions {
    display: flex;
    justify-content: center;
    font-weight: 700;
    gap: variables.$space-l;

    button ~ button {
      text-transform: capitalize;
    }
  }

  .drawer__main {
    margin: 1rem 0;
  }
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
