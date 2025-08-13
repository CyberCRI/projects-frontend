<template>
  <div class="admin-block">
    <div class="admin-block-header">
      <h4 class="title">
        {{ blockTitle }}
      </h4>
      <slot name="actions" />
    </div>
    <div v-if="isLoading" class="loader">
      <LoaderSimple />
    </div>
    <template v-else>
      <div class="admin-block-content">
        <slot />
      </div>
      <div class="admin-block-footer">
        <slot name="footer" />
      </div>
    </template>
  </div>
</template>
<script>
import LoaderSimple from '@/components/base/loader/LoaderSimple.vue'
export default {
  name: 'AdminBlock',

  components: {
    LoaderSimple,
  },

  props: {
    blockTitle: {
      type: String,
      required: true,
    },
    isLoading: {
      type: Boolean,
      default: false,
    },
  },
}
</script>
<style lang="scss" scoped>
.admin-block {
  padding: $space-2xl 0;
  position: relative;
}

/* stylelint-disable-next-line  at-rule-no-unknown */
@mixin block-separator {
  content: '';
  display: block;
  height: 0;
  position: absolute;
  top: 0;
  left: 0;
  right: 66%;
  border-top: $border-width-s solid $primary;
}

.admin-block ~ .admin-block::before {
  /* stylelint-disable-next-line  at-rule-no-unknown */
  @include block-separator;
}

@media (max-width: $min-desktop) {
  /* stylelint-disable-next-line selector-pseudo-class-no-unknown */
  :global(.admin-section ~ .admin-section > .admin-block::before) {
    /* stylelint-disable-next-line  at-rule-no-unknown */
    @include block-separator;
  }
}

.admin-block-header,
.admin-block-content {
  padding-bottom: $space-unit;
}

.admin-block-header {
  display: flex;
  gap: $space-unit;
  align-items: flex-start;
  justify-content: space-between;
}

.admin-block-footer {
  display: flex;
  gap: 1rem;
  justify-content: flex-end;
}

.loader {
  display: flex;
  justify-content: center;
  padding: $space-l 0;
}
</style>
