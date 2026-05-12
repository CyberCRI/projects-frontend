<script setup lang="ts">
const runtimeConfig = useRuntimeConfig()

const props = defineProps<{
  recapchaKey: string
}>()

const model = defineModel<string>()

const setToken = (respToken) => (model.value = respToken)

const setHeaderScript = async () => {
  // already Set
  if (document.getElementById('recaptchaScript')) {
    return window.grecaptcha
  }

  const script = document.createElement('script')
  script.setAttribute('async', '')
  script.setAttribute('defer', '')
  script.id = 'recaptchaScript'
  script.src = 'https://www.google.com/recaptcha/api.js?render=explicit'
  document.getElementsByTagName('head')[0].appendChild(script)
}

const initCaptcha = () => {
  window.grecaptcha.render(props.recapchaKey, {
    sitekey: runtimeConfig.public.appCaptchaKey,
    callback: setToken,
  })
}

onBeforeMount(() => {
  if (import.meta.dev) {
    model.value = 'DEV-TOKEN'
  }
  if (import.meta.client) {
    setHeaderScript()
  }
})

watch(
  () => props.recapchaKey,
  () => {
    if (model.value) {
      window.grecaptcha.reset(model.value)
      initCaptcha()
    }
  },
  { immediate: true }
)
</script>

<template>
  <div class="form-section captcha_cont has-text-centered">
    <div :id="recapchaKey" />
  </div>
</template>
