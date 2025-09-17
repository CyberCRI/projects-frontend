<script setup>
defineProps({
  location: { type: Object, required: true },
  isEditable: { type: Boolean, default: false },
})

defineEmits(['focus-location', 'delete-location', 'edit-location'])
</script>
<template>
  <div class="location-list-item">
    <div class="location-title">
      <h4>{{ location.title }}</h4>
      <p>{{ location.description }}</p>
    </div>
    <ContextActionButton
      secondary
      no-border
      action-icon="MapMarker"
      @click="$emit('focus-location', location)"
    />
    <ContextActionMenu
      v-if="isEditable"
      class="location-actions"
      can-edit
      can-delete
      @edit="$emit('edit-location', location)"
      @delete="$emit('delete-location', location)"
    />
  </div>
</template>
<style scoped lang="scss">
.location-list-item {
  display: flex;
  background-color: $primary-lighter;
  border-radius: 0.8rem;
  padding: 0.5em;
  align-items: flex-start;
  gap: 1rem;

  .location-title {
    flex-grow: 1;

    h4 {
      font-weight: 600;
    }

    p {
      font-size: 0.8rem;
      font-weight: 300;
    }
  }
}
</style>
