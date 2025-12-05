<template>
  <BasicCard :to-link="!isPrivateUser ? toLink : null" :mode="mode" @click="userAction($event)">
    <template #actions-right>
      <slot name="actions">
        <IconImage v-if="user.email" class="icon" name="EmailOutline" @click="mailTo" />
      </slot>
    </template>
    <CroppedApiImage
      :alt="`${user.given_name} ${user.family_name} image`"
      class="picture picture-user"
      :picture-data="user.profile_picture"
      picture-size="medium"
      :default-picture="DEFAULT_USER_PATATOID"
    />
    <div class="text text-limit">
      <div class="card-type">
        {{ userGroups }}
      </div>
      <div class="card-title">{{ user.given_name }} {{ user.family_name }}</div>
      <div class="card-description">
        {{ translatedJob }}
      </div>
    </div>
  </BasicCard>
</template>
<script>
import BasicCard from '@/components/base/BasicCard.vue'
import IconImage from '@/components/base/media/IconImage.vue'
import CroppedApiImage from '@/components/base/media/CroppedApiImage.vue'
import { DEFAULT_USER_PATATOID } from '@/composables/usePatatoids'

export default {
  name: 'UserCard',

  components: {
    BasicCard,
    IconImage,
    CroppedApiImage,
  },

  props: {
    user: {
      type: Object,
      required: true,
    },
    toLink: {
      type: [String, Object],
      default: null,
    },
    mode: {
      type: String,
      default: 'card', // 'card' or 'list'
    },
  },

  emits: ['click'],

  setup(props) {
    const { getTranslatableField } = useAutoTranslate()
    const translatedJob = getTranslatableField(props.user, 'job')

    return {
      translatedJob,
      DEFAULT_USER_PATATOID,
    }
  },

  data() {
    return {
      isDetailOpen: false,
    }
  },

  computed: {
    isPrivateUser() {
      // Private users do not return an iD from API call
      return !this.user.id
    },
    userGroups() {
      // TODO: use first group name plus groups number (ex: "Staff (+4)")
      // when data will be available in api
      return ''
    },
  },

  methods: {
    mailTo() {
      document.location.href = 'mailto:' + this.user.email
    },
    userAction(event) {
      if (this.isPrivateUser) return

      this.$emit('click', event)
    },
  },
}
</script>

<style lang="scss" scoped>
.picture {
  border-radius: 100%;
}

.card-title {
  text-transform: capitalize;
}
</style>
