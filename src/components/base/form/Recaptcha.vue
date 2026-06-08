<script setup lang="ts">
import { onClient } from '~/composables/onClient'

const runtimeConfig = useRuntimeConfig()

const props = defineProps<{
  recapchaKey: string
}>()

const model = defineModel<string>()

const setToken = (respToken) => (model.value = respToken)

const setHeaderScript = onClient(() => {
  // already Set
  console.log('recaptachScript')
  if (document.getElementById('recaptchaScript')) {
    return window.grecaptcha
  }

  console.log('recaptaet script')

  const script = document.createElement('script')
  script.setAttribute('async', '')
  script.setAttribute('defer', '')
  script.id = 'recaptchaScript'
  script.src = 'https://www.google.com/recaptcha/api.js?render=explicit'
  document.getElementsByTagName('head')[0].appendChild(script)
})

const initCaptcha = onClient(() => {
  setHeaderScript()
  window.grecaptcha.render(props.recapchaKey, {
    sitekey: runtimeConfig.public.appCaptchaKey,
    callback: setToken,
  })
})

const initialize = onClient(() => {
  if (model.value) {
    window.grecaptcha.reset(model.value)
  }
  initCaptcha()
})

onBeforeMount(() => setHeaderScript())

watch(() => props.recapchaKey, initialize, { immediate: true })
</script>

<template>
  <div class="form-section captcha_cont has-text-centered">
    <div :id="recapchaKey" />
  </div>
</template>
