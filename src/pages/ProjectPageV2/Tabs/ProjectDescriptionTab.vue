<template>
  <div>
    <div v-if="project" class="project-description">
      <PageStickyHead :page-title="project.$t.title">
        <template #default="{ anchorOffset }">
          <!--div v-if="showEditButton" class="description-edit">
            <LpiButton
              class="edit-description-button"
              btn-icon="Pen"
              :label="$t('common.edit')"
              data-test="edit-description"
              @click="editDescriptionModalActive = !editDescriptionModalActive"
            />
          </div-->
          <PageIndex v-show="hasSummary">
            <template #default="{ closeSummary }">
              <DescriptionSummaryBlock
                ref="summaryBlock"
                summary-text-container=".description-content"
                :anchor-offset="anchorOffset"
                @item-clicked="
                  (evt) => {
                    scrollToSection(evt)
                    closeSummary()
                  }
                "
                @summary-length-changed="hasSummary = !!$event"
              />
            </template>
          </PageIndex>
        </template>
      </PageStickyHead>

      <DescriptionPlaceholder
        v-if="canEditProject && showDescriptionPlaceHolder"
        :project="project"
      />

      <TipTapOutput v-else class="description-content" :content="description" />
    </div>

    <DescriptionDrawer
      :is-opened="editDescriptionModalActive"
      :project="updatedProject"
      @close="close"
    />
  </div>
</template>

<script>
import useProjectsStore from '@/stores/useProjects.ts'
export default {
  name: 'ProjectDescriptionTab',

  props: {
    project: {
      type: Object,
      default: () => {},
    },
  },

  setup() {
    const projectsStore = useProjectsStore()
    useScrollToTab()
    const { canEditProject } = usePermissions()
    return {
      projectsStore,
      canEditProject,
    }
  },

  data() {
    const { getTranslatableField } = useAutoTranslate()
    return {
      editDescriptionModalActive: false,
      hasSummary: false,
      // TODO: temp fix for encoding bug, to be removed soon
      description: computed(() =>
        unref(getTranslatableField(this.projectsStore.project, 'description'))?.replaceAll(
          /\xa0»/g,
          '"'
        )
      ),
      // description: getTranslatableField(this.projectsStore.project, 'description')
    }
  },

  computed: {
    updatedProject() {
      return this.projectsStore.project
    },

    showDescriptionPlaceHolder() {
      return this.project.description.length === 0 || this.project.description === '<p></p>'
    },
    // showEditButton() {
    //   return this.canEditProject && !this.showDescriptionPlaceHolder
    // },
  },

  watch: {
    description: {
      handler(neo, old) {
        if (neo !== old) {
          this.$nextTick(() => {
            this.$refs.summaryBlock?.loadSummary()
          })
        }
      },
    },
    //   showEditButton: {
    //     handler: function (neo, old) {
    //       if (neo != old) {
    //         // give time to render content
    //         this.$nextTick(() => {
    //           this.computeAnchorOffset()
    //         })
    //       }
    //     },
    //     immediate: true,
    //   },
  },

  methods: {
    close() {
      this.editDescriptionModalActive = !this.editDescriptionModalActive
    },
    scrollToSection(targetId) {
      const target = document.getElementById(`anchor-${targetId}`)
      let offset = 20
      const header = document.querySelector('.header__container')
      if (header) {
        offset += header.getBoundingClientRect().height
      }

      const stickyHead = document.querySelector('.page-sticky-head')
      if (stickyHead) {
        offset += stickyHead.getBoundingClientRect().height
      }
      if (target) {
        const bbox = target.getBoundingClientRect()
        const top = bbox.top
        window.scroll({
          left: 0,
          top: window.scrollY + top - offset,
          behavior: 'smooth',
        })
      }
    },
  },
}
</script>

<style lang="scss" scoped>
.project-description {
  .description-content {
    background: $white;
    padding: $space-l 0;
    padding-top: 0;
    overflow-wrap: break-word;
    color: $almost-black;
    flex-grow: 1;
    overflow: auto;
  }

  .summary {
    max-width: 100%;
    min-width: 300px;
  }
}

// :deep(.description-content > p),
// :deep(.description-content > h1),
// :deep(.description-content > h2),
// :deep(.description-content > h3),
// :deep(.description-content > h4),
// :deep(.description-content > h5),
// :deep(.description-content > h6),
// :deep(.description-content > ul),
// :deep(.description-content > ol),
// :deep(.description-content > blockquote),
// :deep(.description-content > pre),
// :deep(.description-content > .custom-video-ctn) {
//   max-width: pxToRem(800px);
//   margin-left: auto;
//   margin-right: auto;
// }

:deep(.anchor-element) {
  display: inline-block;
}

@keyframes rotate-pen {
  0% {
    transform: rotate(0deg);
  }

  25% {
    transform: rotate(10deg);
  }

  75% {
    transform: rotate(-10deg);
  }

  100% {
    transform: rotate(0deg);
  }
}
</style>
