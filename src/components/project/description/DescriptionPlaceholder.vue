<template>
  <div class="description-placeholder">
    <p class="text">
      {{ $t('description.placeholder') }}
    </p>

    <LpiButton
      :label="$filters.capitalize($t('description.add'))"
      btn-icon="ArrowRight"
      :reversed-order="true"
      data-test="add-description-button"
      @click="editDescriptionModalActive = !editDescriptionModalActive"
    />

    <DescriptionDrawer
      v-if="editDescriptionModalActive"
      :is-opened="editDescriptionModalActive"
      :project="project"
      @close="close"
    />
  </div>
</template>

<script>
import DescriptionDrawer from '@/components/project/description/DescriptionDrawer.vue'
import LpiButton from '@/components/base/button/LpiButton.vue'
export default {
  name: 'DescriptionPlaceholder',

  components: {
    DescriptionDrawer,
    LpiButton,
  },

  props: {
    project: {
      type: Object,
      required: true,
    },
  },

  data() {
    return {
      editDescriptionModalActive: false,
    }
  },

  methods: {
    close() {
      this.editDescriptionModalActive = !this.editDescriptionModalActive
    },
  },
}
</script>

<style lang="scss" scoped>
.description-placeholder {
  background: $primary-lighter;
  border-radius: $border-radius-l;
  padding: $space-l;
  display: flex;
  flex-direction: column;
  align-items: center;

  .text {
    margin-bottom: $space-l;
  }
}
</style>
