<template>
  <div class="total-container">
    <span class="projects-count">{{ displayedNumber }}</span>
    <span class="projects-word">{{ $t('stats.projects') }}</span>
  </div>
</template>

<script setup>
defineOptions({ name: 'LpiSingleStatChart' })
const props = defineProps({
  number: {
    type: Number,
    default: null,
  },
})

const chartData = null
const displayedNumber = ref(0)

let intervalId = null
onMounted(() => {
  if (chartData === displayedNumber.value) return
  intervalId = setInterval(() => {
    const change = (props.number - displayedNumber.value) / 10
    displayedNumber.value += change > 0 ? Math.ceil(change) : Math.floor(change)
  }, 20)
})

onBeforeUnmount(() => {
  clearInterval(intervalId)
})
</script>

<style lang="scss" scoped>
.total-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  .projects-count {
    font-size: 7rem;
    font-weight: 700;
    color: $primary;
    margin-bottom: -10px;
  }

  .projects-word {
    font-size: 1.5rem;
    font-weight: 700;
    color: $primary-dark;
  }
}
</style>
