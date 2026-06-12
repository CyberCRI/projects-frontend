<template>
  <PageStickyHead :page-title="title">
    <template #default="{ anchorOffset }">
      <PageIndex v-show="hasSummary">
        <template #default="{ closeSummary }">
          <DescriptionSummaryBlock
            ref="summaryBlock"
            class="skeletons-background"
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

  <TipTapOutput class="description-content skeletons-background" :content="description" />
  <NothingHere v-if="descriptionEmpty" />
</template>

<script setup lang="ts">
import TipTapOutput from '~/components/base/form/TextEditor/TipTapOutput.vue'
import PageStickyHead from '~/components/base/navigation/PageStickyHead.vue'
import PageIndex from '~/components/base/navigation/PageIndex.vue'
import NothingHere from '~/components/base/NothingHere.vue'
import { onClient } from '~/composables/onClient'
import { textIsEmpty } from '~/functs/string'

const props = defineProps<{
  title: string
  description: string
}>()

const hasSummary = ref(false)

// TODO: temp fix for encoding bug, to be removed soon
const description = computed(() => {
  return (props.description || '').replaceAll(/\xa0»/g, '"')
})

const descriptionEmpty = computed(() => textIsEmpty(description.value))

const summaryBlock = useTemplateRef('summaryBlock')
watch(description, (neo, old) => {
  if (neo !== old) {
    nextTick(() => {
      summaryBlock.value?.loadSummary()
    })
  }
})

const scrollToSection = onClient((targetId) => {
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
})
</script>

<style lang="scss" scoped>
.description-content {
  background: $white;
  padding: $space-l 0;
  padding-top: 0;
  overflow-wrap: break-word;
  color: $almost-black;
  flex-grow: 1;
  overflow: auto;
}
</style>
