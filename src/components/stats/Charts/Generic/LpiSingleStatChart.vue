<template>
  <div class="total-container">
    <span class="projects-count">{{ displayedNumber }}</span>
    <span class="projects-word">{{ $t('stats.projects') }}</span>
  </div>
</template>

<script>
export default {
  name: 'LpiSingleStatChart',
  props: {
    number: {
      type: Number,
      default: null,
    },
  },
  data() {
    return {
      displayedNumber: 0,
      interval: false,
    }
  },
  mounted() {
    if (this.chartData === this.displayedNumber) return
    this.interval = window.setInterval(() => {
      const change = (this.number - this.displayedNumber) / 10
      this.displayedNumber += change > 0 ? Math.ceil(change) : Math.floor(change)
    }, 20)
  },
  beforeUnmount() {
    clearInterval(this.interval)
  },
}
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
