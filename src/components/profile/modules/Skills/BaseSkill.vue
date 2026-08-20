<script setup lang="ts">
import PaginationButtonsV2 from '~/components/base/navigation/PaginationButtonsV2.vue'
import { factoryPagination, maxSkeleton } from '~/skeletons/base.skeletons'
import type { TranslatedUserModel } from 'shared-projects-frontend/models'
import SkillItem from '~/components/people/skill/SkillItem.vue'
import FetchLoader from '~/components/base/FetchLoader.vue'
import { skillSkeleton } from '~/skeletons/skill.skeletons'
import { getUserSkills } from '~/api/v2/skills.service'

const props = withDefaults(
  defineProps<{
    user: TranslatedUserModel
    preview?: boolean
    limit?: number
    editable?: boolean
  }>(),
  {
    preview: false,
    limit: null,
    editable: false,
  }
)

const userSlugOrId = computed(() => props.user.slug || props.user.id)

const limitSkeletons = computed(() => maxSkeleton(props.user.modules.skills, props.limit))
const organizationCode = useOrganizationCode()

const {
  error,
  status,
  data: skills,
  pagination,
} = getUserSkills(organizationCode, userSlugOrId, {
  default: () => factoryPagination(skillSkeleton, limitSkeletons.value),
  paginationConfig: {
    limit: props.limit,
  },
})
</script>

<template>
  <FetchLoader :status="status" :error="error" only-error skeleton>
    <BaseModuleHeader v-if="!preview" :editable="editable" :pagination="pagination" />
    <div class="skills">
      <SkillItem
        v-for="skill in skills"
        :key="skill.id"
        :label="skill.tag.$t.title"
        :description="skill.tag.$t.description"
        :level="skill.level"
      />
    </div>
    <PaginationButtonsV2 v-if="!preview" :pagination="pagination" />
  </FetchLoader>
</template>

<style lang="scss">
.skills {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}
</style>
