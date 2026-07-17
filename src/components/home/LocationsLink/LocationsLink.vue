<script setup lang="ts">
import LpiButton from '~/components/base/button/LpiButton.vue'

const locationButtonHover = ref(false)
</script>

<template>
  <div class="locations-link" :class="{ 'is-hovered': locationButtonHover }">
    <LpiButton
      :label="$t('home.check-locations')"
      secondary
      class="white-bg"
      :to="{ name: 'map' }"
      @mouseover="locationButtonHover = true"
      @mouseout="locationButtonHover = false"
    />
  </div>
</template>

<style lang="scss" scoped>
@use '~/design/scss/variables';

.locations-link {
  margin-top: variables.$space-l;
  display: flex;
  align-items: center;
  justify-content: space-around;
  flex-wrap: wrap;
  padding: variables.$space-l variables.$space-s;
  border-radius: variables.$border-radius-8;
  border: variables.$border-width-s solid variables.$primary-dark;
  background-image: url('#{variables.$PUBLIC_BINARIES_PREFIX}/map-images/map-link-background.png');
  background-size: 100%;
  background-position: center;
  transition: all 0.3s ease-in-out;

  @media screen and (max-width: variables.$max-mobile) {
    background-size: cover;
  }

  &.is-hovered {
    background-size: 120%;
  }
}
</style>
