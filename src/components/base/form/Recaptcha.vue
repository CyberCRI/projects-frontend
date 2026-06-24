<script setup lang="ts">
import { onClient } from '~/composables/onClient'

const runtimeConfig = useRuntimeConfig()

const recapchaKey = useUniqueId()

const model = defineModel<string>()

const setToken = (respToken) => (model.value = respToken)

const recapchaRef = useTemplateRef('recapchaRef')
const initCaptcha = onClient(() => {
  window.grecaptcha.render(recapchaRef.value, {
    sitekey: runtimeConfig.public.appCaptchaKey,
    callback: setToken,
  })
})

onClientMounted(() => {
  if (model.value) {
    window.grecaptcha.reset(model.value)
  }
  initCaptcha()
})
</script>

<template>
  <div class="form-section captcha_cont has-text-centered">
    <div :id="recapchaKey" ref="recapchaRef" />
  </div>
</template>
