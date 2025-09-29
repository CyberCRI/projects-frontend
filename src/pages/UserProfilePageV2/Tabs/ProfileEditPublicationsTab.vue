<template>
  <div class="profile-publications">
    <div>
      <h4 class="title">
        {{ title }}
        <span>({{ user.publications.length }})</span>
      </h4>
    </div>
  </div>
</template>

<script setup>
import useUsersStore from '@/stores/useUsers.ts'

defineOptions({
  name: 'ProfileEditPublicationsTab',
})

const { t } = useNuxtI18n()

const props = defineProps({
  user: {
    type: Object,
    required: true,
  },
})
</script>
