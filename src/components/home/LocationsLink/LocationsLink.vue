<script setup lang="ts">
import LpiButton from '@/components/base/button/LpiButton.vue'
const locationButtonHover = ref(false)
</script>

<template>
  <div class="locations-link" :class="{ 'is-hovered': locationButtonHover }">
    <LpiButton
      :label="$t('home.check-locations')"
      secondary
      class="white-bg"
      @click="$router.push({ name: 'map' })"
      @mouseover="locationButtonHover = true"
      @mouseout="locationButtonHover = false"
    />
  </div>
</template>
<style lang="scss" scoped>
.locations-link {
  margin-top: $space-l;
  display: flex;
  align-items: center;
  justify-content: space-around;
  flex-wrap: wrap;
  padding: $space-l $space-s;
  border-radius: $border-radius-8;
  border: $border-width-s solid $primary-dark;
  background-image: url('#{$PUBLIC_BINARIES_PREFIX}/map-images/map-link-background.png');
  background-size: 100%;
  background-position: center;
  transition: all 0.3s ease-in-out;

  @media screen and (max-width: $max-mobile) {
    background-size: cover;
  }

  &.is-hovered {
    background-size: 120%;
  }
}
</style>
