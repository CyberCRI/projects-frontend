<template>
  <div class="outer">
    <div
      class="description-container"
      :class="{
        limited: isLimited && showLess,
      }"
    >
      <TipTapOutput ref="content" class="description" :content="description" />
      <div class="description-limited-transparancy" />
    </div>
    <LpiButton
      v-if="isLimited"
      secondary
      class="no-border"
      :btn-icon="showLess ? 'ChevronDown' : 'ChevronUp'"
      :label="showLess ? $t('group.see-more') : $t('group.see-less')"
      @click.prevent="toggleDescription"
    >
      {{ showLess ? $t('group.see-more') : $t('group.see-less') }}
    </LpiButton>
  </div>
</template>

<script setup lang="ts">
import TipTapOutput from '@/components/base/form/TextEditor/TipTapOutput.vue'
import { onResizeElement } from '@/composables/onResize'

const props = withDefaults(
  defineProps<{
    description: string
    heightLimit: number
    opened?: boolean
  }>(),
  { opened: false }
)

const showLess = ref(!props.opened)
const isLimited = ref(true)
const contentRef = useTemplateRef('content')
const actualHeight = ref(0)
const minHeight = computed(() => Math.min(props.heightLimit, actualHeight.value))
const toggleDescription = () => (showLess.value = !showLess.value)

const checkLimited = () => {
  const rect = contentRef.value.$el.getBoundingClientRect()
  actualHeight.value = rect.height
  isLimited.value = rect.height > props.heightLimit
}
onResizeElement(checkLimited, contentRef, { immediate: true })
</script>

<style lang="scss" scoped>
.no-border {
  border: 0 !important;
}

.description-container {
  overflow: hidden;
  position: relative;
  transition: height 0.2s;
  height: calc(v-bind('actualHeight') * 1px + 1rem);

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
