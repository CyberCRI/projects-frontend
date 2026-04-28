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

    <DescriptionDrawer :is-opened="editDescriptionModalActive" :project="project" @close="close" />
  </div>
</template>

<script setup lang="ts">
import type { TranslatedProject } from '~/models/project.model'

import { textIsEmpty } from '~/functs/string'

const props = defineProps<{
  project: TranslatedProject
}>()

useScrollToTab()
const { canEditProject } = usePermissions()

const editDescriptionModalActive = ref(false)
const hasSummary = ref(false)

// TODO: temp fix for encoding bug, to be removed soon
const description = computed(() => {
  return (props.project.$t?.description || props.project.description || '').replaceAll(
    /\xa0»/g,
    '"'
  )
})

const showDescriptionPlaceHolder = computed(() => textIsEmpty(props.project.description))

const summaryBlock = useTemplateRef('summaryBlock')
watch(description, (neo, old) => {
  if (neo !== old) {
    nextTick(() => {
      summaryBlock.value?.loadSummary()
    })
  }
})

const close = () => {
  editDescriptionModalActive.value = !editDescriptionModalActive.value
}

const scrollToSection = (targetId) => {
  if (!import.meta.client) return
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
