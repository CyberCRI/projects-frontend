<template>
  <NavPanelAside :class="{ 'profile-edit-tabs': isEditing }">
    <div v-if="isSelf || canEditUser" class="edit-btn-ctn">
      <GroupButton
        :model-value="isEditing"
        :options="[
          { value: false, label: 'Show' },
          { value: true, label: 'Edit' },
        ]"
        :label="editButtonLabel"
        btn-icon="Pen"
        :data-test="isEditing ? 'display-profile' : 'edit-profile'"
        class="edit-btn small"
        @update:model-value="switchView"
      />
    </div>

    <NavPanelMenu :menu-entries="profileTabs" :current-tab="currentTab" @navigated="navigated" />

    <div
      v-if="!hasNoContact"
      class="user-contacts-ctn"
      :class="{
        'mail-only': hasOnlyMail,
      }"
    >
      <div v-if="user && user.email" class="social">
        <IconImage class="icon" name="Email" />
        <a :href="`mailto:${user.email}`">{{ $t('complete-profile.personal.email') }}</a>
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

      <a v-if="user.facebook" class="social" :href="user.facebook" target="_blank">
        <IconImage class="icon" name="Facebook" />
        <span>{{ socialName(user.facebook) }}</span>
      </a>

      <a v-if="user.linkedin" class="social" :href="user.linkedin" target="_blank">
        <IconImage class="icon" name="Linkedin" />
        <span>{{ socialName(user.linkedin) }}</span>
      </a>

      <a v-if="user.skype" class="social" :href="user.skype" target="_blank">
        <IconImage class="icon" name="Skype" />
        <span>{{ user.skype }}</span>
      </a>

      <a v-if="user.website" class="social" :href="user.website" target="_blank">
        <IconImage class="icon" name="Globe" />
        <span>{{ user.website }}</span>
      </a>
    </div>
  </NavPanelAside>
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
    socialName(url) {
      let socialArr = url.split('/')
      // if url end with a "/" last item is empty
      if (socialArr.length > 0 && socialArr[socialArr.length - 1])
        return socialArr[socialArr.length - 1]
      // so fallback to the second last item
      if (socialArr.length > 1 && socialArr[socialArr.length - 2])
        return socialArr[socialArr.length - 2]
      // or fallback to the url itself
      return url
    },

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
.edit-btn-ctn {
  padding-bottom: 1rem;
  display: flex;
  justify-content: center;
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
    gap: $space-xs;

    .icon {
      flex-shrink: 0;
      vertical-align: baseline;
      width: 22px;
      height: 22px;
      fill: $primary-dark;
    }

    a {
      font-weight: 500;
      font-size: $font-size-m;
      color: $primary-dark;
    }
  }

  a.social:hover {
    text-decoration: underline;
  }
}
</style>
