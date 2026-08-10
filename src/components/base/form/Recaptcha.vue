<script setup lang="ts">
import FieldErrors from '~/components/base/form/FieldErrors.vue'
import type { ErrorObject } from '@vuelidate/core'
import { onClient } from '~/composables/onClient'
import { isNil } from 'es-toolkit'

withDefaults(
  defineProps<{
    errors?: ErrorObject[]
  }>(),
  {
    errors: () => [],
  }
)

const runtimeConfig = useRuntimeConfig()

const recapchaKey = useUniqueId()

const model = defineModel<string>()

const widgetID = ref<number>()

const setToken = (respToken: string) => (model.value = respToken)
const resetToken = () => (model.value = '')

const recapchaRef = useTemplateRef('recapchaRef')
const initCaptcha = onClient(() => {
  widgetID.value = window.grecaptcha.render(recapchaRef.value, {
    sitekey: runtimeConfig.public.appCaptchaKey,
    callback: setToken,
    'error-callback': () => resetToken(),
    'expired-callback': () => resetToken(),
  })
})

onClientMounted(() => {
  // if widget already created, reset it
  if (!isNil(widgetID.value)) {
    window.grecaptcha.reset(widgetID.value)
  }
  initCaptcha()
})
</script>

<template>
  <div class="form-section captcha_cont has-text-centered">
    <div :id="recapchaKey" ref="recapchaRef" />
    <FieldErrors :errors="errors" />
  </div>
</template>
