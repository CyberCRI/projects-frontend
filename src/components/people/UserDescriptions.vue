<template>
  <div class="user-descriptions" :class="{ limited: isLimited }">
    <div v-if="isLimited" :style="limiterStyle" class="limited-description">
      <HtmlLimiter
        :html="fullDescription"
        :striped-tags="['table']"
        class="description-content"
        @computed="layoutComputed"
        @computing="computeLayout"
      />
    </div>
    <div v-else class="full-description">
      <!-- work description -->
      <div class="description-content" v-html="fullDescription" />
    </div>
    <div v-if="isLimited" class="see-more">
      <SeeMoreArrow data-test="see-more-bio" @click.prevent="goToProfileBio" />
    </div>
  </div>
</template>

<script setup lang="ts">
import SeeMoreArrow from '~/components/base/button/SeeMoreArrow.vue'
import type { TranslatedUserModel } from '~/models/user.model'
import HtmlLimiter from '~/components/base/HtmlLimiter.vue'
import type { StyleValue } from 'vue'

const tabsLayoutSelectTab = inject<(number) => void>('tabsLayoutSelectTab')

const props = withDefaults(
  defineProps<{
    user?: TranslatedUserModel
    isLimited?: boolean
  }>(),
  {
    user: null,
    isLimited: false,
  }
)
const limiterStyle = ref<StyleValue>()

const fullDescription = computed(() => {
  return `<div class="description-content">${props.user?.$t?.description}</div>`
})

const computeLayout = () => {
  limiterStyle.value = {}
}
const layoutComputed = (event) => {
  limiterStyle.value = { height: event.height + 'px' }
}
const goToProfileBio = () => tabsLayoutSelectTab(1)
</script>

<style lang="scss" scoped>
.limited-description {
  display: flex;
  flex-flow: column nowrap;
  justify-content: flex-start;
  align-items: stretch;
  height: pxToRem(320px);
}

.user-descriptions {
  padding: $space-l;

  &.limited {
    @media all and (min-width: $max-tablet) {
      border: $border-width-s solid $primary;
      border-radius: $border-radius-l;
    }
  }

  .description-content {
    margin-bottom: $space-l;
  }

  :deep(.title) {
    font-size: $font-size-m;
    font-weight: 700;
    color: $primary-dark;
    margin-bottom: $space-l;
  }
}

.see-more {
  display: flex;
  justify-content: flex-end;
}
</style>
