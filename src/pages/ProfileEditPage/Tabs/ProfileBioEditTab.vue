<template>
  <div class="profile-edit-bio">
    <div class="header">
      <LinkButton
        class="edit-btn"
        btn-icon="Eye"
        :label="$t('profile.edit.back-to-profile')"
        :to="profileBioLink"
        data-test="edit-bio"
      />
    </div>
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
      <TipTapEditor ref="faq-editor" v-model="form.bio" data-test="long-bio-editor" />
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
        :disabled="confirmActionDisabled || asyncing"
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
import TextInput from '@/components/base/form/TextInput.vue'
import LpiButton from '@/components/base/button/LpiButton.vue'
import TipTapEditor from '@/components/base/form/TextEditor/TipTapEditor.vue'
import { patchUser } from '@/api/people.service.ts'
import useToasterStore from '@/stores/useToaster.ts'
import useUsersStore from '@/stores/useUsers.ts'
import LinkButton from '@/components/base/button/LinkButton.vue'

function defaultForm() {
  return {
    shortBio: '',
    bio: '<p></p>',
  }
}

export default {
  name: 'ProfileBioEditTab',
  components: {
    TextInput,
    LpiButton,
    TipTapEditor,
    LinkButton,
  },

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
    return {
      toaster,
      usersStore,
    }
  },
  data() {
    return {
      form: defaultForm(),
      asyncing: false,
      confirmActionDisabled: false,
    }
  },

  computed: {
    isSelf() {
      const connectedUser = this.usersStore.userFromApi
      return connectedUser && this.user.id === connectedUser.id
    },
    profileBioLink() {
      return {
        name: 'ProfileBio' + (this.isSelf ? '' : 'Other'),
        params: this.isSelf ? {} : { userId: this.user.slug || this.user.id },
      }
    },
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
    cancel() {
      this.resetForm()
    },
    async save() {
      this.asyncing = true
      try {
        const data = {
          short_description: this.form.shortBio,
          description: this.form.bio,
        }

        await patchUser(this.user.id, data)
        this.$emit('profile-edited')

        // update store if self
        if (this.isSelf) this.usersStore.getUser(this.user.id)
        this.toaster.pushSuccess(this.$t('profile.edit.bio.save-success'))
      } catch (error) {
        this.toaster.pushError(`${this.$t('profile.edit.bio.save-error')} (${error})`)
        console.error(error)
      } finally {
        this.asyncing = false
      }
    },
    resetForm() {
      if (this.user) {
        this.form = {
          shortBio: this.user.short_description || '',
          bio: this.user.description || '<p></p>',
        }
      } else {
        this.form = defaultForm()
      }
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

.header {
  padding-top: $space-m;
  display: flex;
  justify-content: flex-end;
  align-items: center;
}
</style>
