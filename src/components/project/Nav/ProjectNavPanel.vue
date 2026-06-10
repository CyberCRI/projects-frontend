<template>
  <NavPanelAside>
    <div v-if="project && canEditProject" class="edit-btn-ctn skeletons-background">
      <GroupButton
        :model-value="isEditing"
        :options="[
          { value: false, label: 'Show' },
          { value: true, label: 'Edit' },
        ]"
        :data-test="isEditing ? 'display-project' : 'edit-project'"
        class="edit-btn small"
        @update:model-value="switchView"
      />
    </div>

    <NavPanelMenu
      :menu-entries="projectTabs"
      :current-tab="currentTab"
      @navigated="emit('navigated')"
    />

    <div class="extra-buttons skeletons-background">
      <ExternalLabelButton
        v-if="usersStore.isConnected"
        class="space-button"
        :label="isFollowing ? $t('project.followed') : $t('project.follow')"
        :btn-icon="isFollowing ? 'BookmarkFill' : 'BookmarkLine'"
        vertical-layout
        label-on-hover
        @click="toggleFollow"
      />
      <ExternalLabelButton
        v-if="project.modules.announcements"
        class="space-button article-button"
        :label="$t('project.announcements')"
        btn-icon="BullhornOutline"
        vertical-layout
        :nb-button="project.modules.announcements"
        label-on-hover
        :to="{
          name: 'projectAnnouncements',
          params: { slugOrId: project.slug || project.id },
        }"
      />
      <ExternalLabelButton
        class="space-button"
        :label="$t('comment.comment-verb')"
        btn-icon="ChatBubble"
        vertical-layout
        label-on-hover
        :to="{
          name: 'projectComments',
          params: { slugOrId: project.slug || project.id },
        }"
      />
      <template v-if="appGotenbergEnabled && usersStore.isConnected">
        <ExternalLabelButton
          class="space-button"
          :label="$t('pdf.download-pdf')"
          btn-icon="FilePdfLine"
          vertical-layout
          label-on-hover
          @click="openModals('pdf')"
        />
      </template>
      <SocialShareButton :shared-url="sharedUrl" />
    </div>

    <div v-if="actionMenu.length" class="side-actions skeletons-background">
      <NavPanelMenu
        :menu-entries="actionMenu"
        @navigated="emit('navigated')"
        @action-triggered="actionTriggered"
      >
        <li class="navpanel-menu-entry">
          <ToolTip class="project-infos-tip shadowed w-full" placement="top" trigger="clickToOpen">
            <template #custom-content>
              <dl class="projects-infos-list">
                <dt>{{ $t('header.views') }}</dt>
                <dd>{{ project?.views }}</dd>
                <dt>{{ $t('header.creation') }}</dt>
                <dd v-if="project.created_at">{{ $d(new Date(project.created_at)) }}</dd>

                <dt>{{ $t('header.update') }}</dt>
                <dd v-if="project.updated_at">{{ $d(new Date(project.updated_at)) }}</dd>
              </dl>
            </template>
            <span class="navpanel-menu-link" data-test="project-infos">
              <IconImage class="icon" name="InfoCardLine" />

              {{ $t('project.infos') }}
            </span>
          </ToolTip>
        </li>
      </NavPanelMenu>
    </div>

    <!-- similars projects -->
    <FetchLoader v-if="project.modules.similars" :status="status" only-error skeleton>
      <ProjectsNavSimilar id="similar-projects" :projects="similars" class="similar-projects" />
    </FetchLoader>

    <!-- drawer/modal -->
    <ProjectPDFModal v-if="stateModals.pdf" :project="project" @close="closeModals('pdf')" />

    <ConfirmModal
      v-if="stateModals.duplicate"
      :asyncing="asyncing"
      :title="$t('project.duplicate.title')"
      :content="$t('project.duplicate.help')"
      @cancel="closeModals('duplicate')"
      @confirm="onDuplicate"
    />

    <ReportDrawer
      :is-opened="stateModals.abuse || stateModals.bug"
      :type="stateModals.abuse ? 'abuse' : 'bug'"
      @close="closeAllModals"
    />
  </NavPanelAside>
</template>

<script setup lang="ts">
import ProjectsNavSimilar from '~/components/project/Nav/ProjectsNavSimilar.vue'
import type { MenuEntry } from '~/components/base/navigation/NavPanelMenu.vue'
import { useProjectFollow } from '~/composables/project/useProjectFollow'
import { duplicateProject, patchProject } from '~/api/projects.service'
import ProjectPDFModal from '~/components/project/ProjectPDFModal.vue'
import ConfirmModal from '~/components/base/modal/ConfirmModal.vue'
import ReportDrawer from '~/components/drawer/ReportDrawer.vue'
import { projectSkeleton } from '~/skeletons/project.skeletons'
import type { TranslatedProject } from '@/models/project.model'
import LpiButton from '~/components/base/button/LpiButton.vue'
import { factoriesSkeleton } from '~/skeletons/base.skeletons'
import { getProjectSimilars } from '~/api/v2/project.service'
import FetchLoader from '~/components/base/FetchLoader.vue'
import type { IconImageChoice } from '~/functs/IconImage'
import useUsersStore from '@/stores/useUsers'

const props = withDefaults(
  defineProps<{
    project: TranslatedProject
    projectTabs?: any[]
    currentTab?: any
    isEditing?: boolean
  }>(),
  {
    projectTabs: () => [],
    currentTab: null,
    isEditing: false,
  }
)

const emit = defineEmits<{
  navigated: []
  'update-follow': any
  'toggle-editing': [boolean]
}>()

const asyncing = ref(false)
const toaster = useToaster()
const { stateModals, closeModals, openModals, closeAllModals } = useModals({
  duplicate: false,
  abuse: false,
  bug: false,
  pdf: false,
})

const { t } = useNuxtI18n()
const router = useRouter()
const usersStore = useUsersStore()

const organizationCode = useOrganizationCode()

const project = computed(() => props.project)
const projectId = computed(() => project.value.id)

const { canEditProject, isOrgUser } = usePermissions()
const { isFollowing, toggleFollow } = useProjectFollow(project)

const LIMIT_SIMILARS = 5

const { status, data: similars } = getProjectSimilars(organizationCode, projectId, {
  query: {
    organizations: [organizationCode],
  },
  paginationConfig: {
    limit: LIMIT_SIMILARS,
  },
  default: () => factoriesSkeleton(projectSkeleton, props.project.modules.similars, LIMIT_SIMILARS),
})

// generate PDF
const { appGotenbergEnabled } = useRuntimeConfig().public

const actionMenu = computed(
  () =>
    [
      {
        icon: 'Copy' as IconImageChoice,
        key: 'duplicate',
        condition: canEditProject.value || isOrgUser.value,
        label: t('project.duplicate.label'),
        isAddAction: true,
        addModal: 'duplicate',
        dataTest: 'duplicate-project',
      },
      {
        icon: 'Bug' as IconImageChoice,
        condition: true,
        label: t('report.bug'),
        isAddAction: true,
        ignoreUnsavedEdit: true,
        addModal: 'bug',
        key: 'bug',
        dataTest: 'report-bug',
      },
      {
        icon: 'Flag' as IconImageChoice,
        condition: true,
        label: t('report.abuse'),
        isAddAction: true,
        ignoreUnsavedEdit: true,
        addModal: 'abuse',
        key: 'abuse',
        dataTest: 'report-abuse',
      },
    ].filter((a) => a.condition) satisfies MenuEntry[]
)

const sharedUrl = useRequestURL()
const switchView = () => emit('toggle-editing', !props.isEditing)

const actionTriggered = (menu: (typeof actionMenu.value)[0]) => {
  // @ts-expect-error ignore
  openModals(menu.addModal)
}

// drawer callback
const onDuplicate = () => {
  asyncing.value = true
  duplicateProject(props.project.id)
    .then((project) => {
      // update projects title (to add copy)
      // TODO add this in backend ?
      return patchProject(project.id, {
        title: `${project.title} ${t('project.copy')}`,
      })
    })
    .then((project) => {
      // redirect to new projects
      toaster.pushSuccess(t('toasts.project-duplication.success'))
      router.push({
        name: 'ProjectSnapshot',
        params: {
          slugOrId: project.slug || project.id,
        },
      })
    })
    .catch(() => toaster.pushError(t('toasts.project-duplication.error')))
    .finally(() => {
      asyncing.value = false
      closeModals('duplicate')
    })
}
</script>

<style lang="scss" scoped>
@import '~/components/base/navigation/navpanel-menu-entry';

.edit-btn-ctn {
  padding-bottom: 1rem;
  display: flex;
  justify-content: center;
}

.similar-projects {
  margin-top: 3rem;
}

.extra-buttons {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  padding: 0.5rem 0;
  margin: 0.5rem 0;
  border-width: 1px 0;
  border-style: solid;
  border-color: var(--light-gray);

  --external-button-outer-size: 1.2rem;
  --external-button-inner-size: 1.2rem;

  .space-button-loader-ctn {
    display: inline-block;
    padding-top: 1rem;
  }

  .space-button-loader {
    width: var(--external-button-outer-size);
    height: var(--external-button-outer-size);
  }
}

.projects-infos-list {
  dt {
    font-weight: bold;
  }

  dd {
    margin: 0;
  }

  dd + dt {
    margin-top: 0.5rem;
  }
}
</style>
