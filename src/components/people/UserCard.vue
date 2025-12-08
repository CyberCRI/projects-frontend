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
  return !props.user.id
})
const userGroups = computed(() => {
  // TODO: use first group name plus groups number (ex: "Staff (+4)")
  // when data will be available in api
  return ''
})

const mailTo = () => {
  document.location.href = 'mailto:' + props.user.email
}
const userAction = (event) => {
  if (isPrivateUser.value) return

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
</style>
