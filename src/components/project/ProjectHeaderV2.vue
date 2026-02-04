<template>
  <div :class="{ loading }" class="project-header-ctn">
    <div class="img-block">
      <ProjectHeaderImage class="img-ctn" :project="project" :loading="loading" />
    </div>
    <div class="text-content">
      <ProjectHeaderTitle class="title-block" :project="project" :loading="loading" />

      <ProjectHeaderTagList
        class="tag-list-bloc tag-list-desktop"
        :project="project"
        :loading="loading"
        tag-prefix="desktop"
      />

      <ProjectHeaderPurpose
        v-if="showPurposeWithEmptyContent"
        class="purpose-block"
        :project="project"
        :loading="loading"
      />

      <ProjectHeaderVisibility class="visibility-ctn" :project="project" :loading="loading" />

      <ProjectHeaderSdgList :sdgs="sdgs" :loading="loading" class="sdg-ctn" />
    </div>
  </div>
</template>

<script>
import useOrganizationsStore from '@/stores/useOrganizations.ts'
import useUsersStore from '@/stores/useUsers.ts'

export default {
  name: 'ProjectHeaderV2',

  inject: ['projectLayoutGoToTab'],
  props: {
    project: {
      type: Object,
      default: () => ({}),
    },

    sdgs: {
      type: Array,
      default: () => [],
    },

    loading: {
      type: Boolean,
      default: true,
    },
  },

  emits: ['show-project-announcements', 'update-follow'],
  setup() {
    const organizationsStore = useOrganizationsStore()
    const usersStore = useUsersStore()
    const runtimeConfig = useRuntimeConfig()
    return {
      organizationsStore,
      usersStore,
      runtimeConfig,
    }
  },

  computed: {
    showPurposeWithEmptyContent() {
      return this.project && this.project.purpose !== '   ' && this.project.purpose.length !== 0
    },
  },

  mounted() {
    window.addEventListener('click', this.onClick)
  },

  unmounted() {
    window.removeEventListener('click', this.onClick)
  },
}
</script>

<style lang="scss" scoped>
.project-header-ctn {
  position: relative;
  display: flex;
  flex-flow: column nowrap;
  gap: 1.25rem;

  @media screen and (min-width: $min-tablet) {
    border: $border-width-s solid $primary;
    border-radius: $border-radius-l;
    z-index: 1;
    padding: 2.5rem;
  }

  @media screen and (min-width: $max-tablet) {
    flex-flow: row nowrap;
    align-items: center;
    gap: 2.5rem;
  }
}

.img-block {
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
}

.text-content {
  display: flex;
  flex-direction: column;
  justify-content: center;
  flex-grow: 1;
  position: relative;
  gap: 1.25rem;

  @media screen and (max-width: $min-tablet) {
    .title-block {
      order: 1;
    }

    .purpose-block {
      order: 2;
    }

    .tag-list-bloc {
      order: 3;
    }

    .sdg-ctn {
      order: 4;
    }

    .visibility-ctn {
      order: 5;
    }
  }
}
</style>
