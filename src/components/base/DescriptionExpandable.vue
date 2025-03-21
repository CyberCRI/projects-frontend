<template>
  <div class="outer">
    <template v-if="showLess">
      <div :style="style" class="description description-limited">
        <HtmlLimiter
          :html="description"
          :striped-tags="[]"
          class="description-content"
          preprocess
          @computed="layoutComputed"
          @computing="computeLayout"
        />
      </div>
    </template>
    <TipTapOutput v-else class="description" :content="description" />
    <div v-if="isLimited" class="toggle-ctn">
      <span class="toggle" @click="toggleDescription">
        {{ showLess ? $t('group.see-more') : $t('group.see-less') }}
      </span>
    </div>
  </div>
</template>

<script>
import HtmlLimiter from '@/components/base/HtmlLimiter.vue'
import TipTapOutput from '@/components/base/form/TextEditor/TipTapOutput.vue'
export default {
  name: 'DescriptionExpandable',
  components: { HtmlLimiter, TipTapOutput },
  props: {
    description: {
      type: String,
      required: true,
    },
    heightLimit: {
      type: Number,
      required: true,
    },
  },
  data() {
    return {
      showLess: true,
      isLimited: true,
      style: { height: `${this.heightLimit}px` },
    }
  },
  methods: {
    toggleDescription() {
      this.showLess = !this.showLess
    },

    computeLayout() {
      this.style = { height: `${this.heightLimit}px` }
    },
    layoutComputed(event) {
      this.style = { height: event.height + 'px' }
      this.isLimited = event.croppedHtml != this.description
    },
  },
}
</script>

<style lang="scss" scoped>
.description-limited {
  position: relative;
  display: flex;
  flex-flow: column;
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
