<template>
  <div class="sub-section">
    <h2 v-if="sectionTitle" class="title">
      {{ sectionTitle }}
    </h2>
    <p v-if="sectionNotice" class="notice">
      {{ sectionNotice }}
    </p>
    <slot />
  </div>
</template>
<script>
export default {
  name: 'AccountSection',

  props: {
    sectionTitle: {
      type: String,
      default: '',
    },
    sectionNotice: {
      type: String,
      default: '',
    },
  },
}
</script>
<style lang="scss" scoped>
.sub-section {
  padding-top: $space-xl;

  .title {
    font-weight: 700;
    font-size: $font-size-l;
    color: $black;
  }

  .notice {
    margin: pxToRem(16px) 0;
  }
}
</style>
