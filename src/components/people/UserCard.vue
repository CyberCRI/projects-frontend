<template>
  <BasicCard
    :is-inactive="isPrivateUser"
    :to-link="!isPrivateUser ? toLink : null"
    :mode="mode"
    @click="userAction($event)"
  >
    <template #actions-right>
      <slot name="actions">
        <IconImage v-if="user.email" class="icon" name="EmailOutline" @click="mailTo" />
      </slot>
    </template>
    <CroppedApiImage
      :alt="`${user.given_name} ${user.family_name} image`"
      class="picture picture-user skeletons-image"
      :picture-data="user.profile_picture"
      picture-size="medium"
      :default-picture="DEFAULT_USER_PATATOID"
    />
    <div class="text text-limit">
      <div v-if="role" class="card-type badge w-fit skeletons-text">
        {{ role }}
      </div>
      <div class="card-title skeletons-text">{{ user.given_name }} {{ user.family_name }}</div>
      <div class="card-description skeletons-text">
        {{ translatedJob }}
      </div>
    </div>
  </BasicCard>
</template>

<script setup>
import BasicCard from '@/components/base/BasicCard.vue'
import IconImage from '@/components/base/media/IconImage.vue'
import CroppedApiImage from '@/components/base/media/CroppedApiImage.vue'
import { DEFAULT_USER_PATATOID } from '@/composables/usePatatoids'

defineOptions({ name: 'UserCard' })

const props = defineProps({
  user: {
    type: Object,
    required: true,
  },
  toLink: {
    type: [String, Object],
    default: null,
  },
  role: {
    type: String,
    default: '',
  },
  mode: {
    type: String,
    default: 'card', // 'card' or 'list'
  },
})

const emit = defineEmits(['click'])
const { getTranslatableField } = useAutoTranslate()
const translatedJob = getTranslatableField(props.user, 'job')

const isPrivateUser = computed(() => {
  // Private users do not return an iD from API call
  return !props.user?.id
})

const mailTo = () => {
  document.location.href = 'mailto:' + props.user.email
}
const userAction = (event) => {
  emit('click', event)
}
</script>

<style lang="scss" scoped>
.picture {
  border-radius: 100%;
}

.card-title {
  text-transform: capitalize;
}

.badge {
  background: $primary-dark;
  font-weight: 400;
  font-size: $font-size-s;
  margin-top: $space-s;
  padding: $space-2xs;
  color: $white;
  border-radius: 10px;
}
</style>
