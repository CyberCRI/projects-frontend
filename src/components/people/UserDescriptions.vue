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

<script>
import HtmlLimiter from '@/components/base/HtmlLimiter.vue'
import SeeMoreArrow from '@/components/base/button/SeeMoreArrow.vue'
export default {
  name: 'UserDescriptions',
  components: {
    HtmlLimiter,
    SeeMoreArrow,
  },

  inject: {
    selectTab: {
      from: 'tabsLayoutSelectTab',
      default: () => {},
    },
  },

  props: {
    user: {
      type: Object,
      default: () => {},
    },
    isLimited: {
      type: Boolean,
      default: false,
    },
  },

  data() {
    return {
      limiterStyle: {},
    }
  },

  computed: {
    fullDescription() {
      return `
                <div class="description-content">
                    ${this.user.description}
                </div>
            `
    },
  },

  methods: {
    computeLayout() {
      this.limiterStyle = {}
    },
    layoutComputed(event) {
      this.limiterStyle = { height: event.height + 'px' }
    },
    goToProfileBio() {
      this.selectTab(1)
    },
  },
}
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
