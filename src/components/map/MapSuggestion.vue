<template>
  <div class="wrapper">
    <div ref="marker" class="map-pointer">
      <div class="badge" @click="$emit('pick-location', location)">
        <div :class="location.type" class="badge__dot" />
        <div class="badge__label">
          {{ location.label }}
        </div>
      </div>

      <div class="line" />
    </div>
  </div>
</template>

<script>
export default {
  name: 'MapSuggestion',

  props: {
    location: {
      type: Object,
      default: null,
    },
  },

  emits: ['mounted', 'unmounted', 'pick-location'],

  mounted() {
    this.$emit('mounted', {
      location: this.location,
      markerContent: this.$refs.marker,
    })
  },

  unmounted() {
    this.$emit('unmounted', this.location)
  },
}
</script>

<style lang="scss" scoped>
.wrapper {
  display: none;
}

.map-pointer {
  display: flex;
  flex-direction: column;
  align-items: center;

  .badge {
    background: $white;
    display: flex;
    justify-content: center;
    align-items: center;
    padding: $space-m;
    height: auto;
    box-sizing: border-box;
    border: $border-width-s solid $primary-dark;
    border-radius: $border-radius-l;
    cursor: pointer;
    transition:
      height 0.15s ease-in-out,
      width 0.15s ease-in-out;

    &__dot {
      width: 16px;
      height: 16px;
      border-radius: 50%;
      margin-right: $space-s;

      &.impact {
        background: $violet;
      }

      &.team {
        background: $primary;
      }
    }

    &__label {
      color: $primary-dark;
      font-size: $font-size-xs;
      text-transform: uppercase;
      font-weight: 700;
    }
  }

  .line {
    width: 3px;
    height: 35px;
    background: $primary-dark;
    position: relative;

    &::after {
      content: '';
      width: 10px;
      height: 10px;
      position: absolute;
      bottom: 0;
      left: 50%;
      transform: translateX(-50%);
      background: $primary-dark;
      border-radius: 50%;
    }
  }
}

.actions {
  display: flex;
  position: absolute;
  top: 0;
  right: 0;
  left: 0;
  justify-content: flex-end;
  gap: $space-xs;
  z-index: 10;
  transform: translate(0, -50%);
}
</style>
