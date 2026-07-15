<template>
  <div class="empty-card">
    <slot>
      <p class="empty-label">
        {{ label }}
      </p>
    </slot>
  </div>
</template>

<script setup lang="ts">
withDefaults(
  defineProps<{
    label?: string
  }>(),
  { label: '' }
)
</script>
<style lang="scss" scoped>
@use '~/design/scss/variables';

// same as src/components/base/BasicCard.vue except for border color and justify content
.empty-card {
  display: flex;
  position: relative;
  flex-direction: column;
  justify-content: space-around;
  height: variables.$card_height;
  width: variables.$card_width;
  border: variables.$border-width-s solid variables.$lighter-gray;
  border-radius: variables.$border-radius-m;
  text-align: center;
  background: variables.$white;
  overflow: hidden;
}

.empty-label {
  text-align: center;
  color: variables.$mid-gray;
  font-weight: 700;
  font-size: variables.$font-size-s;
}
</style>
