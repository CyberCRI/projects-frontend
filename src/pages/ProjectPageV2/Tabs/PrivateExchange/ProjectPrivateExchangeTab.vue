<template>
  <div class="project-comments narrow-content">
    <div class="header">
      <h2 class="title">
        {{ $t('comment.private-exchange.title') }}
      </h2>
      <p class="notice">
        {{ $t('comment.private-exchange.notice') }}
      </p>
    </div>
    <MakeComment
      :project="project"
      is-private
      @project-message-posted="$emit('reload-project-messages')"
    />

    <NoItem v-if="!projectMessages.length" message="comment.private-exchange.no-message" />

    <div v-else>
      <CommentItem
        v-for="projectMessage in projectMessages"
        :id="projectMessage.id"
        :key="projectMessage.id"
        is-private
        :project="project"
        :comment="projectMessage"
        @project-message-posted="$emit('reload-project-messages')"
        @project-message-edited="$emit('reload-project-messages')"
        @project-message-deleted="$emit('reload-project-messages')"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import CommentItem from '@/components/project/comment/CommentItem.vue'
import NoItem from '@/components/project/comment/NoItem.vue'
import MakeComment from '@/components/project/comment/MakeComment.vue'
import useUsersStore from '@/stores/useUsers'
import { TranslatedProject } from '@/models/project.model'
import { ProjectTeamModel } from '@/models/project-member.model'

const props = withDefaults(
  defineProps<{
    project?: TranslatedProject
    projectMessages?: any[]
    team?: ProjectTeamModel
  }>(),
  {
    project: null,
    projectMessages: () => [],
    team: null,
  }
)

defineEmits<{
  'reload-project-messages': []
}>()

const router = useRouter()
const route = useRoute()
const usersStore = useUsersStore()
const { isAdmin } = usePermissions()

useScrollToTab()

const isMemberOrAdmin = computed(() => {
  const members = [...props.team.members, ...props.team.owners, ...props.team.reviewers]
  return isAdmin.value || members.find((user) => usersStore.id === user.id)
})

watch(
  () => props.project,
  (neo) => {
    if (neo && !isMemberOrAdmin.value) {
      router.replace({
        name: 'pageProject',
        params: { slugOrId: props.project.slug || props.project.id },
      })
    }
  },
  { immediate: true }
)

onMounted(() => {
  if (!props.project) {
    router.replace({
      name: 'pageProject',
      params: { slugOrId: route.params.slugOrId },
    })
  }
})
</script>

<style lang="scss" scoped>
.header {
  margin-bottom: 2rem;

  .title {
    font-size: $font-size-2xl;
    font-weight: 700;
    line-height: 1.25;
  }

  .notice {
    margin-top: 1rem;
    font-size: $font-size-m;
  }
}

.project-comments {
  margin-top: $space-2xl;
  margin-bottom: $space-l;
}
</style>
