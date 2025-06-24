<template>
  <div class="nav-panel">
    <div class="nav-panel-inner">
      <div v-if="isSelf || canEditUser" class="edit-btn-ctn">
        <GroupButton
          :model-value="isEditing"
          :options="[
            { value: false, label: 'Show' },
            { value: true, label: 'Edit' },
          ]"
          :label="editButtonLabel"
          btn-icon="Pen"
          data-test="edit-profile"
          class="edit-btn small"
          :to="editProfileLink"
          @update:model-value="switchView"
        />
      </div>
      <menu>
        <li
          v-for="entry in profileTabs"
          :key="entry.view"
          class="menu-entry"
          :class="{ active: entry == currentTab }"
        >
          <NuxtLink
            v-if="entry.condition"
            class="link"
            :data-test="entry.dataTest"
            :to="entry.view"
            @click="navigated"
          >
            <IconImage class="icon" :name="entry.icon || 'Article'" />
            {{ entry.label }}

            <IconImage v-if="entry.actionIcon" class="icon action-icon" :name="entry.actionIcon" />
          </NuxtLink>
        </li>
      </menu>

      <div
        v-if="!hasNoContact"
        class="user-contacts-ctn"
        :class="{
          'mail-only': hasOnlyMail,
        }"
      >
        <div v-if="user && user.email" class="social">
          <IconImage class="icon" name="Email" />
          <span>{{ user.email }}</span>
        </div>

        <!-- TODO: Use privacy settings -->
        <div v-if="user.mobile_phone" class="social">
          <IconImage class="icon" name="Phone" />
          <span>{{ user.mobile_phone }}</span>
        </div>

        <div v-if="user.landline_phone" class="social">
          <IconImage class="icon" name="Phone" />
          <span>{{ user.landline_phone }}</span>
        </div>

        <div v-if="user && user.location" class="social">
          <IconImage class="icon" name="MapMarker" />
          <span v-html="fixLocation(user.location)" />
        </div>

        <SocialNetworks :user="user" />
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ProfileNavPanel',

  props: {
    user: {
      type: Object,
      default: () => {},
    },

    isSelf: {
      type: Boolean,
      default: false,
    },

    editButtonLabel: {
      type: String,
      required: true,
    },
    editProfileLink: {
      type: Object,
      required: true,
    },

    canEditUser: {
      type: Boolean,
      default: false,
    },
    profileTabs: { type: Array, required: true },
    currentTab: {
      type: Object,
      default: () => {},
    },
    isEditing: {
      type: Boolean,
      default: false,
    },
  },

  emits: ['navigated'],
  // data() {
  //   return {
  //     addToProjectMenuVisible: false,
  //   }
  // },

  computed: {
    hasOnlyMail() {
      return (
        !this.user?.mobile &&
        !this.user?.location &&
        !this.user?.facebook &&
        !this.user?.twitter &&
        !this.user?.linkedin &&
        !this.user?.skype
      )
    },
    hasNoContact() {
      return !this.user?.email && this.hasOnlyMail
    },
  },

  methods: {
    fixLocation(l) {
      return l.split('\n').join('<br />')
    },

    navigated() {
      this.$emit('navigated')
    },

    // toggleAddToProject() {
    //   this.addToProjectMenuVisible = !this.addToProjectMenuVisible
    // },

    switchView() {
      this.$router.push(this.editProfileLink)
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
    z-index: 100;
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

.add-to-project-ctn {
  display: flex;
  justify-content: center;
  position: relative;
  padding: 0.5rem 0;

  .add-to-project-button:hover,
  .project-config-button:hover {
    opacity: 1 !important;
  }

  .add-to-project-button.active,
  .project-config-button.active {
    background-color: $white !important;
    color: $primary-dark !important;

    svg {
      fill: $primary-dark;
    }
  }

  .add-to-project,
  .project-config {
    position: absolute;
    z-index: $zindex-toast;
  }

  .add-to-project {
    bottom: 0;
    left: 1px;
  }

  .project-config {
    top: 42px;
    right: 0;
  }
}

.user-contacts-ctn {
  border: 1px solid $lighter-gray;
  border-radius: 1rem;
  padding: 1rem;
  display: flex;
  flex-flow: column;
  gap: 1rem;
  margin-top: 3rem;

  &.mail-only {
    justify-content: center;
  }

  .social {
    display: flex;
    align-items: flex-start;
    word-break: break-word;

    span {
      padding-top: pxToRem(4px);
    }

    & ~ .social {
      margin-top: $space-m;
    }
  }

  .icon {
    width: 22px;
    height: 22px;
    fill: $primary-dark;
    margin-right: $space-xs;
    margin-top: 4px;
  }

  span {
    font-weight: 700;
    font-size: $font-size-m;
    color: $primary-dark;
  }
}
</style>
