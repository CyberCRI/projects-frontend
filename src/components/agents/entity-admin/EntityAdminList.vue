<script setup>
const props = defineProps({
  fetchEntities: { type: Function, required: true },
  noEntityLabel: { type: String, required: true },
  entityIcon: { type: String, required: true },
  deletableCheck: { type: Function, default: () => null },
  isLinkable: { type: Boolean, default: false },
})

const emit = defineEmits(['goto-entity', 'show-entity', 'delete-entity', 'edit-entity'])

const isAsyncing = ref(false)
const entityList = ref([])

const refresh = async () => {
  isAsyncing.value = true
  try {
    entityList.value = await props.fetchEntities()
    console.log('entityList', entityList.value)
  } catch (e) {
    console.log(e.toString())
  } finally {
    isAsyncing.value = false
  }
}
defineExpose({ refresh })

refresh()
</script>
<template>
  <div v-if="isAsyncing" class="loader">
    <LoaderSimple />
  </div>
  <p v-else-if="!entityList.length" class="no-entity">
    {{ noEntityLabel }}
  </p>
  <ul v-else>
    <li v-for="entity in entityList" :key="entity.id" class="entity">
      <div class="icon">
        <IconImage :name="entityIcon" />
      </div>
      <div class="entity-content">
        <slot :entity="entity" />
      </div>
      <div class="actions">
        <ContextActionButton
          v-if="isLinkable"
          action-icon="ArrowUpRightFromSquare"
          secondary
          no-border
          @click.prevent="emit('goto-entity', entity)"
        />
        <ContextActionButton
          action-icon="Eye"
          secondary
          no-border
          @click.prevent="emit('show-entity', entity)"
        />
        <ContextActionButton
          action-icon="Pen"
          secondary
          no-border
          @click.prevent="emit('edit-entity', entity)"
        />
        <ContextActionButton
          action-icon="TrashCanOutline"
          secondary
          no-border
          :disabled="props.deletableCheck(entity)"
          @click.prevent="emit('delete-entity', entity)"
        />
      </div>
    </li>
  </ul>
</template>
<style lang="scss" scoped>
.entity {
  display: flex;
  gap: 1rem;
  padding: 0.6rem;
  border: 1px solid $primary;
  border-radius: 0.6rem;
  justify-content: stretch;
  align-items: center;
}

.entity ~ .entity {
  margin-top: 1rem;
}

.icon,
.actions {
  flex-grow: 0;
  flex-shrink: 0;
}

.entity-content {
  flex-grow: 1;
}

.icon svg {
  width: 2rem;
  fill: $light-gray;
}

.actions {
  display: flex;
  gap: 0.6rem;
}

.loader {
  display: flex;
  justify-content: center;
  padding: 2rem;
}

.no-entity {
  text-align: center;
  font-style: italic;
}
</style>
