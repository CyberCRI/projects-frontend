<template>
  <div class="outer">
    <div
      class="description-container"
      :class="{
        limited: isLimited && showLess,
      }"
    >
      <div ref="content">
        <slot>
          <TipTapOutput class="description tiptap-output" :content="description" />
        </slot>
      </div>
      <div class="description-limited-transparancy" />
    </div>
    <LpiButton
      v-if="isLimited && !hideSeeMore"
      secondary
      class="no-border"
      :btn-icon="showLess ? 'ChevronDown' : 'ChevronUp'"
      :label="showLess ? label.more : label.less"
      @click.prevent="toggleDescription"
    >
      {{ showLess ? label.more : label.less }}
    </LpiButton>
  </div>
</template>

<script setup lang="ts">
import TipTapOutput from '@/components/base/form/TextEditor/TipTapOutput.vue'
import { onResizeElement } from '@/composables/onResize'

const props = withDefaults(
  defineProps<{
    description?: string
    heightLimit: number
    opened?: boolean
    seeMoreLabel?: string
    seeLessLabel?: string
    hideSeeMore?: boolean
  }>(),
  { opened: null, description: null, seeMoreLabel: null, seeLessLabel: null, hideSeeMore: false }
)

const showLess = ref(true)
const isLimited = ref(true)
const contentRef = useTemplateRef('content')
const actualHeight = ref(0)
const minHeight = computed(() => Math.min(props.heightLimit, actualHeight.value))
const toggleDescription = () => (showLess.value = !showLess.value)

watch(
  () => props.opened,
  (val) => {
    if (typeof val === 'boolean') {
      showLess.value = !val
    }
  },
  { immediate: true }
)

const checkLimited = () => {
  const rect = contentRef.value.getBoundingClientRect()
  actualHeight.value = rect.height
  isLimited.value = rect.height > props.heightLimit
}
onResizeElement(checkLimited, contentRef, { immediate: true })

const label = computed(() => {
  return {
    less: props.seeLessLabel || $t('common.see-less'),
    more: props.seeMoreLabel || $t('common.see-more'),
  }
})
</script>

<style lang="scss" scoped>
.no-border {
  border: 0 !important;
}

.description-container {
  overflow: hidden;
  position: relative;
  transition: height 0.2s;
  height: calc(v-bind('actualHeight') * 1px);

  .description-limited-transparancy {
    display: none;
  }

  &.limited {
    height: calc(v-bind('minHeight') * 1px);

    .description-limited-transparancy {
      display: block;
      position: absolute;
      bottom: 0;
      left: 0;
      width: 100%;
      height: calc(v-bind('heightLimit') * 1px / 5);
      background: white;
      background: linear-gradient(0deg, rgb(255 255 255 / 100%) 5%, rgb(255 255 255 / 0%) 100%);
    }
  }
}

.outer {
  .toggle {
    color: $primary-dark;
    font-size: $font-size-m;
    cursor: pointer;
    font-weight: 400;
    text-decoration: underline;
  }
}
</style>
