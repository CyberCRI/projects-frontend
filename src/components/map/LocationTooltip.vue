<template>
  <div class="location-tooltip" :class="location.type">
    <div class="title">
      <div :class="location.type" />
      <span>{{ title }}</span>
    </div>

    <p>{{ description }}</p>
  </div>
</template>

<script>
export default {
  name: 'LocationTooltip',

  props: {
    location: {
      type: Object,
      required: true,
    },
  },

  computed: {
    title() {
      return this.cropIfTooLong(this.location.title, 45)
    },

    description() {
      return this.cropIfTooLong(this.location.description, 85)
    },
  },

  methods: {
    cropIfTooLong(text, length) {
      return text.length > length ? text.substring(0, length) + '...' : text
    },
  },
}
</script>

<style lang="scss" scoped>
.location-tooltip {
  min-width: 100px;
  padding: $space-m;

  .title {
    color: $primary-dark;
    font-weight: 700;
    margin-bottom: $space-xs;
    font-size: $font-size-m;
    display: flex;
    align-items: center;
    justify-content: flex-start;

    > div {
      height: 15px;
      width: 15px;
      border-radius: 50%;
      margin-right: $space-s;

      &.impact {
        background: $violet;
      }

      &.team {
        background: $primary;
      }
    }
  }
}
</style>
