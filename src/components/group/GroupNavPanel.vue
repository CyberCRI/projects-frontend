<template>
  <div class="nav-panel">
    <div class="nav-panel-inner">
      <div v-if="canEditGroup" class="edit-btn-ctn">
        <GroupButton
          :model-value="isEditing"
          :options="[
            { value: false, label: 'Show' },
            { value: true, label: 'Edit' },
          ]"
          btn-icon="Pen"
          :data-test="isEditing ? 'show-group' : 'edit-group'"
          class="edit-btn small"
          @update:model-value="switchView"
        />
      </div>
      <menu>
        <li
          v-for="entry in groupTabs"
          :key="entry.view"
          class="menu-entry"
          :class="{ active: entry == currentTab }"
        >
          <NuxtLink
            v-if="entry.condition"
            class="link"
            :data-test="entry.key"
            :to="entry.view"
            @click="navigated"
          >
            <IconImage class="icon" :name="entry.icon || 'Article'" />
            {{ entry.label }}

            <IconImage v-if="entry.actionIcon" class="icon action-icon" :name="entry.actionIcon" />
          </NuxtLink>
        </li>
      </menu>

      <div class="group-contacts-ctn">
        <ToolTip v-if="email" class="share-tip shadowed" placement="bottom" trigger="clickToOpen">
          <template #custom-content>
            <a :href="'mailto:' + email">
              {{ email }}
            </a>
          </template>
          <ExternalLabelButton
            :label="$t('group.contact')"
            btn-icon="EmailOutline"
            vertical-layout
            class="bg-on-hover"
          />
        </ToolTip>
        <SocialShareButton :shared-url="sharedUrl" />
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'GroupNavPanel',

  props: {
    email: {
      type: String,
      default: '',
    },
    groupTabs: { type: Array, required: true },
    currentTab: {
      type: Object,
      default: () => {},
    },
    canEditGroup: {
      type: Boolean,
      default: false,
    },
    isEditing: {
      type: Boolean,
      default: false,
    },
    editGroupLink: {
      type: String,
      default: '',
    },
  },

  emits: ['navigated'],
  // data() {
  //   return {
  //     addToProjectMenuVisible: false,
  //   }
  // },
  data() {
    return {
      sharedUrl: useRequestURL().toString(),
    }
  },

  methods: {
    navigated() {
      this.$emit('navigated')
    },

    // toggleAddToProject() {
    //   this.addToProjectMenuVisible = !this.addToProjectMenuVisible
    // },

    switchView() {
      this.$router.push(this.editGroupLink)
    },
  },
}
</script>

<style lang="scss" scoped>
.nav-panel {
  flex-shrink: 0;
  flex-grow: 0;
}

@media screen and (max-width: $min-tablet) {
  .nav-panel {
    position: fixed;
    box-shadow: 0 0.5rem 1rem rgb(0 0 0 / 10%);
    background-color: $white;
    z-index: 105;
    width: calc(18rem + 2.125rem);
    top: 3rem;
    left: 0;
    bottom: 0;
    overflow-y: auto;
    padding: 2.125rem;
    box-sizing: border-box;
    padding-top: 4rem;
  }
}

@media screen and (min-width: $min-tablet) {
  .nav-panel-inner {
    width: 16rem;
  }
}

.edit-btn-ctn {
  padding-bottom: 1rem;
  display: flex;
  justify-content: center;
}

menu {
  display: flex;
  flex-flow: column;
  gap: 0.5rem;
  list-style-type: none;

  .menu-entry {
    &:hover,
    &.active {
      background-color: $primary-light;
    }

    .link {
      display: flex;
      gap: 1rem;
      align-items: center;
      padding: 0.4rem;
      color: $primary-dark;

      .icon {
        display: inline-block;
        width: 1em;
        height: 1em;
        fill: $primary-dark;
      }

      .action-icon {
        margin-left: auto;
      }
    }
  }
}

.similar-projects {
  margin-top: 3rem;
}

.group-contacts-ctn {
  border: 1px solid $lighter-gray;
  border-radius: 1rem;
  padding: 1rem;
  display: flex;
  flex-flow: row;
  justify-content: space-between;
  gap: 1rem;
  margin-top: 3rem;
}
</style>
