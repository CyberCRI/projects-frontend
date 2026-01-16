<template>
  <div class="on-boarding-page">
    <TipTapOutput :content="onBoardingData.content" class="onboarding-content" />
  </div>
</template>

<script setup lang="ts">
// TODO(remi): component no needed ?
import TipTapOutput from '@/components/base/form/TextEditor/TipTapOutput.vue'

const onBoardingData = ref({
  content: '',
})
const router = useRouter()

onMounted(() => {
  router.replace({ name: 'HelpHelpTab' })
})
</script>

<style lang="scss" scoped>
.on-boarding-page {
  margin: $layout-size-2xl;
}
</style>
