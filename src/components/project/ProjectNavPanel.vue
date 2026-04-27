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
      @action-triggered="onActionTriggered"
    />

    <div class="share-buttons skeletons-background">
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
        :label="$t('group.news')"
        btn-icon="Article"
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
      <!-- <template v-if="appGotenbergEnabled && usersStore.isConnected">
        <ExternalLabelButton
          v-if="!isProcessingPdf"
          class="space-button"
          :label="$t('pdf.download-pdf')"
          btn-icon="FilePdfLine"
          vertical-layout
          label-on-hover
          @click="$emit('get-pdf')"
        />
        <span v-else class="space-button-loader-ctn">
          <LoaderSimple class="space-button-loader" />
        </span>
      </template> -->

      <SocialShareButton :shared-url="sharedUrl" />
    </div>

    <div v-if="actionMenu.length" class="side-actions skeletons-background">
      <NavPanelMenu
        :menu-entries="actionMenu"
        @navigated="emit('navigated')"
        @action-triggered="onActionTriggered"
      >
        <li class="navpanel-menu-entry">
          <ToolTip
            class="project-infos-tip shadowed"
            placement="top"
            trigger="clickToOpen"
            style="width: 100%"
          >
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

    <!-- <SimilarProjectsV2
      v-if="similarProjects && similarProjects.length"
      id="similar-projects"
      :similar-projects="similarProjects"
      class="similar-projects v2"
    /> -->
  </NavPanelAside>
</template>

<script setup lang="ts">
import { TranslatedProject } from '@/models/project.model'
import { useProjectFollow } from '@/pages/ProjectPageV2/useProject'
import useUsersStore from '@/stores/useUsers'

const props = withDefaults(
  defineProps<{
    project: TranslatedProject
    projectTabs?: any[]
    currentTab?: any
    isEditing?: boolean
    // isProcessingPdf?: boolean
    actionMenu?: any[]
  }>(),
  {
    projectTabs: () => [],
    currentTab: null,
    isEditing: false,
    // isProcessingPdf: false,
    actionMenu: () => [],
  }
)

const emit = defineEmits<{
  navigated: []
  'update-follow': any
  'toggle-editing': [boolean]
}>()
// emits: ['update-follow', 'navigated', 'toggle-editing', 'duplicate-project', 'get-pdf'],

const usersStore = useUsersStore()

const { canEditProject } = usePermissions()
const { isFollowing, toggleFollow } = useProjectFollow(computed(() => props.project))
// const { appGotenbergEnabled } = useRuntimeConfig().public

const sharedUrl = useRequestURL()

const onActionTriggered = () => {
  // if (menuEntry.addModal === 'duplicate') {
  //   emit('duplicate-project')
  // } else {
  //   this.projectLayoutToggleAddModal(menuEntry.addModal)
  // }
}

const switchView = () => emit('toggle-editing', !props.isEditing)
</script>

<style lang="scss" scoped>
@import '@/components/base/navigation/navpanel-menu-entry';

.edit-btn-ctn {
  padding-bottom: 1rem;
  display: flex;
  justify-content: center;
}

.similar-projects {
  margin-top: 3rem;
}

.share-buttons {
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
