<template>
  <div class="project-summary">
    <div class="main-ctn">
      <LazyMapRecap v-if="locations.length" class="unboxed" :locations="locations" />
    </div>
  </div>
</template>
<script>
export default {
  name: 'ProjectLocationsTab',
  props: {
    locations: {
      type: Array,
      default: () => [],
    },
  },
}
</script>
