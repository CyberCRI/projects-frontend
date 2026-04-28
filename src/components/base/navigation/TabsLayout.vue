<template>
  <div ref="container" class="tabs">
    <div
      v-click-outside="() => (showTabList = false)"
      :class="{ 'align-left': alignLeft, 'align-right': alignRight, border }"
      class="tabs-header"
    >
      <div class="tabs-slider">
        <div v-if="showTabList && usedTab.length > 0" class="tab-list-ctn">
          <IconImage class="close-icon" name="Close" @click="closeTabList" />
          <ul>
            <li
              v-for="(tab, index) in usedTab"
              :id="tab.id"
              :key="index"
              :ref="'tab-' + index"
              :class="{
                'item-selected': currentTab.label === tab.label,
                'tab--no-border': border,
              }"
              class="item"
              :data-test="tab.key"
              @click="selectTab(isMobile ? index : tab.index)"
            >
              <IconImage v-if="currentTab.label === tab.label" class="icon" name="ArrowRight" />
              <span v-else class="pellet" />
              {{ tab.label }}
            </li>
          </ul>
        </div>

        <div class="tabs-slider-inner">
          <template v-if="!isMobile && displayedTabs.length > 0">
            <div
              v-for="(tab, index) in displayedTabs"
              :id="tab.id"
              :key="index"
              :ref="'tab-' + index"
              :data-test="tab.key"
              :class="{
                selected: routerView ? currentViewIndex === index : current === index,
                'tab--no-border': border,
              }"
              class="tab"
              @click="selectTab(index)"
            >
              {{ tab.label }}
            </div>
          </template>

          <div v-else class="mobile-tab-ctn">
            <div :id="currentTab.id" ref="tab-0" class="tab selected">
              {{ currentTab.label }}
            </div>
            <LinkButton
              v-if="isMobile"
              :label="t('common.see-more')"
              class="more-btn"
              btn-icon="DotsHorizontal"
              data-test="extra-tabs-button-mobile"
              @click="showTabList = !showTabList"
            />
          </div>
        </div>
      </div>
      <div class="btn-ctn">
        <LinkButton
          v-if="!layouting && !isMobile && seeMoreTabs.length > 0"
          :label="t('common.see-more')"
          class="more-btn"
          btn-icon="DotsHorizontal"
          data-test="extra-tabs-button"
          @click="showTabList = !showTabList"
        />
        <slot name="button-1" />
      </div>
    </div>

    <div
      v-if="currentTab"
      :class="{
        border,
        'no-top-left-radius': noTopLeftRadius,
        'no-top-right-radius': noTopRightRadius,
      }"
      class="content"
    >
      <template v-if="currentTab.component && currentTab.key">
        <KeepAlive>
          <Component
            v-bind="currentTab.props"
            :is="currentTab.component"
            :key="currentTab.key"
            @close="$emit('close')"
          />
        </KeepAlive>
      </template>
      <NuxtPage v-else-if="routerView" v-bind="currentTab.props" />
    </div>
  </div>
</template>

<script setup lang="ts">
import LinkButton from '~/components/base/button/LinkButton.vue'
import IconImage from '~/components/base/media/IconImage.vue'

import useViewportWidth from '~/composables/useViewportWidth'

import { debounce } from 'es-toolkit'

const props = withDefaults(
  defineProps<{
    tabs: any[]
    alignLeft?: boolean
    alignRight?: boolean
    border?: boolean
    routerView?: boolean
  }>(),
  {
    alignLeft: false,
    alignRight: false,
    border: true,
    routerView: false,
  }
)

defineEmits<{
  close: []
}>()
const { isMobile } = useViewportWidth()
const { t } = useNuxtI18n()
const router = useRouter()
const route = useRoute()

const current = ref(0)
const showTabList = ref(false)
const displayedTabs = ref([])
const seeMoreTabs = ref([])
const layouting = ref(false)

const currentViewIndex = computed(() => {
  return props.tabs.findIndex((tab) =>
    tab.view?.name
      ? route.matched.some((r) => r.name === tab.view.name)
      : route.path.indexOf(tab.view) === 0
  )
})

const currentTab = computed(() => {
  return props.tabs[props.routerView ? currentViewIndex.value : current.value] || {}
})

const noTopLeftRadius = computed(() => {
  return current.value === 0 && !props.alignRight
})

const noTopRightRadius = computed(() => {
  return current.value === props.tabs.length - 1 && !props.alignLeft
})

const usedTab = computed(() => {
  return isMobile.value ? props.tabs : seeMoreTabs.value
})

const containerRef = useTemplateRef('container')
const layoutTabs = debounce(
  // debounced to not hammer the browser on each resize
  async () => {
    if (!import.meta.client) return

    /* for each tab, we check if it fit in the wrapper
     * if it doesn't, we hide it and add it to the more tabs
     */
    const tabsNode = containerRef.value?.querySelector('.tabs-slider')
    if (!tabsNode) return

    // reset the arrays
    displayedTabs.value.splice(0)
    seeMoreTabs.value.splice(0)

    // for code factorization
    const iterate = async (tabs, displayed, otherTab) => {
      const wrapperRight = tabsNode.getBoundingClientRect()?.right
      let skipOthers = false
      for (let i = 0; i < tabs.length; i++) {
        // add the tag to the displayed tags to compute its size
        displayed.push(tabs[i])
        await nextTick()
        // get the last badge and check if it fits
        const tabsHtmlElement = containerRef.value.querySelectorAll('.tab')
        if (skipOthers) {
          displayed.pop()
          otherTab.push({ ...tabs[i], index: i })
        } else if (tabsHtmlElement.length) {
          const lastTab = tabsHtmlElement[tabsHtmlElement.length - 1]
          const lastTabRight = lastTab.getBoundingClientRect().right
          if (lastTabRight > wrapperRight) {
            // if it doesn't, we hide it and add it to the more tags
            displayed.pop()
            otherTab.push({ ...tabs[i], index: i })
            // remember we started to skip tabs
            // so next are also removed even if they fit
            // and we keep tab order
            skipOthers = true
          }
        }
      }
    }

    const postIterate = async (tabs, displayed, otherTab) => {
      const wrapperRight = tabsNode.getBoundingClientRect()?.right
      // iterate in reverse order until all remaining tabs fit
      for (let i = displayed.length - 1; i > 0; i--) {
        await nextTick()
        // get the last badge and check if it fits
        const tabsHtmlElement = containerRef.value.querySelectorAll('.tab')
        if (tabsHtmlElement.length) {
          const lastTab = tabsHtmlElement[tabsHtmlElement.length - 1]
          const lastTabRight = lastTab.getBoundingClientRect().right
          if (lastTabRight > wrapperRight) {
            // if it doesn't, we hide it and add it to the more tags
            displayed.pop()
            otherTab.unshift({ ...tabs[i], index: i })
          } else {
            break // at this point all remaining tabs fit
          }
        }
      }
    }

    // do the actual job
    layouting.value = true
    await nextTick()
    await iterate(props.tabs, displayedTabs.value, seeMoreTabs.value)
    layouting.value = false
    if (seeMoreTabs.value.length) {
      // now available space might be shorter with the see more button displayed so re-iterate
      await nextTick()
      await postIterate(props.tabs, displayedTabs.value, seeMoreTabs.value)
    }
  },
  42
)

const closeTabList = () => {
  showTabList.value = false
}

const selectTab = (index) => {
  current.value = index
  if (props.routerView) {
    router.push(props.tabs[current.value].view)
  }

  closeTabList()
}

watch(() => props.tabs, layoutTabs, { deep: true, immediate: true })
onResize(layoutTabs)
provide('tabsLayoutSelectTab', selectTab)
</script>

<style lang="scss" scoped>
.tabs {
  position: relative;

  .tabs-header {
    display: flex;
    align-items: flex-end;
    width: 100%;

    &.align-left {
      justify-content: flex-start;
    }

    &.align-right {
      justify-content: flex-end;
    }

    @media screen and (max-width: $min-tablet) {
      flex-flow: column;
      align-items: stretch;
    }

    &.border {
      // room for border radius of content
      padding-left: pxToRem(51px);
      padding-right: pxToRem(51px);
      box-sizing: border-box;
    }

    .tab-nav,
    .tab-nav-ctn {
      flex-basis: $layout-size-4xl;
      width: $layout-size-4xl;
      fill: $primary-dark;
      flex-shrink: 0;

      &.tab-nav-mobile {
        display: inline-block;
        margin-left: auto;
      }

      &.tab-nav-desktop {
        display: none;
      }

      @media screen and (min-width: $min-tablet) {
        &.tab-nav-mobile {
          display: none;
        }

        &.tab-nav-desktop {
          display: inline-block;
        }
      }
    }

    .tab-nav-ctn {
      display: flex;
      justify-content: space-between;
      width: 100%;

      @media screen and (min-width: $min-tablet) {
        display: inline-block;
        width: auto;
      }

      &.empty-on-desktop {
        display: none;
      }
    }

    .tabs-slider {
      flex-grow: 1;
      overflow: hidden;
      padding-top: 2px; // room for the tab upper border not to be cropped
      margin-bottom: -1px; // merge with content top border if it has some (admin, carousel)

      // same as border-bottom: $border-width-s solid $primary;
      // but with a background-image so it passes under the child tab element
      background: transparent
        url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVQIW2NguL38PwAE4wKCsDeq2gAAAABJRU5ErkJggg==')
        left bottom repeat-x;

      .tabs-slider-inner {
        display: flex;
        align-items: flex-end;
        justify-content: flex-start;
        padding-top: pxToRem(4px); // room for the tab upper border not to be cropped

        .mobile-tab-ctn {
          width: 100%;
          display: flex;
          justify-content: space-between;

          .more-btn {
            margin-right: $space-m;
          }
        }
      }

      .tab-list-ctn {
        position: absolute;
        right: 0;
        top: 0;
        background-color: $primary-dark;
        color: $white;
        box-shadow: 0 4px 4px rgb(0 0 0 / 15%);
        border-radius: 8px;
        padding: 24px;
        z-index: 110;

        @media screen and (max-width: $min-tablet) {
          width: 87%;
        }

        .item {
          font-style: normal;
          font-weight: 500;
          font-size: $font-size-m;
          line-height: $line-height-compact;
          display: flex;
          align-items: center;
          text-transform: uppercase;
          color: $white;
          padding: 8px;
          cursor: pointer;

          &-selected {
            background-color: $primary;
            color: $primary-dark;
            border-radius: 8px;
          }
        }

        .pellet {
          background: $primary;
          border: 4px solid $primary;
          border-radius: 50%;
          margin-right: 12px;
        }

        .close-icon {
          position: absolute;
          width: 24px;
          fill: $white;
          right: 4px;
          top: 4px;
          cursor: pointer;
        }

        .icon {
          width: 16px;
          fill: $primary-dark;
          margin-right: 12px;
        }
      }
    }

    .btn-ctn {
      display: flex;
      align-items: center;
      margin-left: $space-m;
      margin-bottom: 0;

      &:empty {
        display: none;
      }

      @media screen and (max-width: $min-tablet) {
        order: -1;
        flex-basis: 100%;
        flex-shrink: 0;
        margin: 0 auto;
        margin-bottom: 24px;
      }

      .more-btn {
        margin-right: pxToRem(16px);
      }
    }

    .tab {
      text-transform: uppercase;
      padding: 9px $space-l;
      cursor: pointer;
      color: $primary-dark;
      font-weight: bold;
      font-size: $font-size-m;
      box-sizing: border-box;
      user-select: none; // avoid text selection while clicking on tab
      transition: transform 0.3s ease-in-out;
      transform-origin: bottom center;
      transform: translateZ(0);
      line-height: 1;

      &--no-border {
        border-bottom: none;
      }

      &:hover {
        transform: translateZ(0) scaleY(1.15);
      }

      &.selected {
        background: $primary-lighter;
        border-left: $border-width-s solid $primary;
        border-top: $border-width-s solid $primary;
        border-right: $border-width-s solid $primary;
        border-top-left-radius: $border-radius-l;
        border-top-right-radius: $border-radius-l;
        border-bottom: $border-width-s solid $primary-lighter; // mask parent pseudo border-bottom with background color

        &:hover {
          transform: none;
        }
      }
    }
  }

  .content {
    border-radius: unset;

    &.border {
      border: $border-width-s solid $primary;
      overflow: hidden;
      border-radius: $border-radius-l;
    }
  }
}
</style>
