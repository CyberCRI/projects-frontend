<template>
  <div class="profile-edit-bio">
    <!--div class="header">
      <LinkButton
        class="edit-btn"
        btn-icon="Eye"
        :label="$t('profile.edit.back-to-profile')"
        :to="profileBioLink"
        data-test="edit-bio"
      />
    </div-->
    <!-- short bio -->
    <div class="form-group">
      <TextInput
        v-model="form.shortBio"
        :label="$t('profile.edit.bio.short-bio.label')"
        :placeholder="$t('profile.edit.bio.short-bio.placeholder')"
        :max-length="300"
        data-test="short-bio-input"
      />
    </div>
    <!-- professional bio -->
    <div class="form-group">
      <label>{{ $t('profile.edit.bio.long-bio.label') }}</label>
      <!--p class="notice">
        {{ $t('profile.edit.bio.professional-bio.placeholder') }}
      </p-->
      <TipTapEditor
        ref="faq-editor"
        :key="user?.id || 'curren-user'"
        v-model="form.bio"
        data-test="long-bio-editor"
      />
    </div>
    <!-- actions -->
    <div class="form-actions">
      <LpiButton
        :disabled="asyncing"
        :label="$filters.capitalize($t('common.cancel'))"
        :secondary="true"
        class="footer__left-button"
        data-test="close-button"
        @click="cancel"
      />

      <LpiButton
        :disabled="asyncing"
        :label="$filters.capitalize($t('common.confirm'))"
        :btn-icon="asyncing ? 'LoaderSimple' : null"
        :secondary="false"
        class="footer__right-button"
        data-test="confirm-button"
        @click="save"
      />
    </div>
  </div>
</template>
<script>
import { patchUser } from '@/api/people.service.ts'
import useToasterStore from '@/stores/useToaster.ts'
import useUsersStore from '@/stores/useUsers.ts'

function defaultForm() {
  return {
    shortBio: '',
    bio: '<p></p>',
  }
}

export default {
  name: 'ProfileBioEditTab',

  props: {
    user: {
      type: Object,
      required: true,
    },
  },

  emits: ['profile-edited'],
  setup() {
    const toaster = useToasterStore()
    const usersStore = useUsersStore()
    const form = ref(defaultForm())

    const { startEditWatcher, stopEditWatcher } = useEditWatcher(form)
    return {
      form,
      toaster,
      usersStore,
      startEditWatcher,
      stopEditWatcher,
    }
  },
  data() {
    return {
      asyncing: false,
    }
  },

  computed: {
    isSelf() {
      if (!this.user) return true
      const connectedUser = this.usersStore.userFromApi
      return connectedUser && this.user?.id === connectedUser?.id
    },
    // profileBioLink() {
    //   return {
    //     name: 'ProfileBio' + (this.isSelf ? '' : 'Other'),
    //     params: this.isSelf ? {} : { userId: this.user?.slug || this.user?.id },
    //   }
    // },
  },

  watch: {
    user: {
      handler(neo) {
        if (neo) this.resetForm()
      },
      immediate: true,
    },
  },

  methods: {
    redirectToProfile() {
      if (this.isSelf) this.$router.push({ name: 'ProfileBio' })
      else
        this.$router.push({
          name: 'ProfileBioOther',
          params: { userId: this.user.id },
        })
    },

    cancel() {
      // this.resetForm()
      this.redirectToProfile()
    },
    async save() {
      this.asyncing = true
      try {
        const data = {
          short_description: this.form.shortBio,
          description: this.form.bio,
        }

        await patchUser(this.user.id, data)

        this.startEditWatcher()

        this.$emit('profile-edited')

        // update store if self
        if (this.isSelf) this.usersStore.getUser(this.user.id)
        this.toaster.pushSuccess(this.$t('profile.edit.bio.save-success'))
        this.redirectToProfile()
      } catch (error) {
        this.toaster.pushError(`${this.$t('profile.edit.bio.save-error')} (${error})`)
        console.error(error)
      } finally {
        this.asyncing = false
      }
    },
    resetForm() {
      this.stopEditWatcher()
      if (this.user) {
        this.form = {
          shortBio: this.user.short_description || '',
          bio: this.user.description || '<p></p>',
        }
      } else {
        this.form = defaultForm()
      }
      this.startEditWatcher()
    },
  },
}
</script>
<style scoped lang="scss">
@import './profile-form';

.form-actions {
  position: sticky;
  bottom: 0;
  background-color: white;
}

// .header {
//   padding-top: $space-m;
//   display: flex;
//   justify-content: flex-end;
//   align-items: center;
// }
</style>
