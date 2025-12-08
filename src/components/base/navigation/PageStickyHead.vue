<template>
  <aside ref="aside" class="page-sticky-head">
    <h1 v-if="isHeaderSticked" class="page-title-recall">
      <div class="text-limiter">{{ pageTitle }}</div>
    </h1>
    <slot
      :anchor-offset="anchorOffset"
      :is-header-sticked="isHeaderSticked"
      :compute-anchor-offset="computeAnchorOffset"
    ></slot>
  </aside>
</template>
<script setup>
import { throttle } from 'es-toolkit'

defineOptions({ name: 'PageStickyHead' })

defineProps({
  pageTitle: {
    type: String,
    required: true,
  },
})

const anchorOffset = ref(0)
const isHeaderSticked = ref(false)

const aside = useTemplateRef('aside')

const computeAnchorOffset = throttle(() => {
  const asideHeight = aside.value ? aside.value.offsetHeight : 0
  anchorOffset.value = asideHeight + 20 /* ??? */
}, 100)

const checkIfSummaryIsSticked = throttle(() => {
  isHeaderSticked.value =
    aside.value?.getBoundingClientRect().top <= 50 /* $navbar-height */ &&
    window?.innerWidth > 768 /* $min-tablet */
}, 16)

onMounted(() => {
  computeAnchorOffset()
  // in unit tests, window might be undefined
  window?.addEventListener('resize', computeAnchorOffset)
  window?.addEventListener('resize', checkIfSummaryIsSticked)
  window?.addEventListener('scroll', checkIfSummaryIsSticked)
})
onBeforeUnmount(() => {
  // in unit tests, window might be undefined
  window?.removeEventListener('resize', computeAnchorOffset)
  window?.addEventListener('resize', checkIfSummaryIsSticked)
  window?.addEventListener('scroll', checkIfSummaryIsSticked)
})
</script>
<style scoped lang="scss">
aside {
  padding: $space-m 0;
  display: flex;
  flex-flow: row;
  justify-content: flex-end;
  align-items: center;
  gap: 1rem;
  background-color: rgb(255 255 255 / 70%);
  position: sticky;
  z-index: 100;
  top: $navbar-height;
}

.page-title-recall {
  flex-grow: 1;
  text-align: left;
  font-size: $font-size-2xl;
  position: relative;
  height: 1.2em;

  .text-limiter {
    position: absolute;
    inset: 0;
    width: calc(100%);
    text-overflow: ellipsis;
    white-space: nowrap;
    overflow: hidden;
  }
}
</style>
