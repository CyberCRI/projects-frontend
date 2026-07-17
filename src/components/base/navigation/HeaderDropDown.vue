<template>
  <div ref="dropDown" v-click-outside="close" :class="{ 'is-open': open }" class="header-drop-down">
    <button class="drop-down-toggle" :data-test="dataTest" @click="toggle">
      <slot :open="open">
        <slot name="badge" />
        <IconImage v-if="icon" :class="{ rounded: roundedIcon }" :name="icon" class="icon" />
        <span class="label-and-icon">
          <span v-if="label" data-test="current-label">{{ label }}</span>
          <span class="icon caret"><IconImage name="MenuDown" /></span>
        </span>
      </slot>
    </button>
    <div
      :style="customStyle"
      class="drop-down-menu-wrapper"
      :class="{
        'clamp-corner': clampCorner,
      }"
    >
      <Transition name="menu-fade">
        <div
          v-if="open"
          :class="{
            'has-separator': hasSeparator,
            'round-corner': roundCorner,
          }"
          class="drop-down-menu custom-scrollbar"
        >
          <LpiLoader v-if="isLoading" class="loader" type="simple" />

          <ul v-else>
            <li v-for="(item, index) in menuItems" :key="index" class="drop-down-menu-item">
              <Component
                :is="getComponent(item)"
                class="drop-down-menu-item-content"
                :to="item.to"
                :data-test="item.dataTest"
                @click="menuAction(item)"
              >
                <span v-if="item.leftIcon" class="menu-icon left-icon">
                  <IconImage :name="item.leftIcon" />
                </span>
                <span class="label">{{ item.label }}</span>
                <span v-if="item.rightIcon" class="menu-icon right-icon">
                  <IconImage :name="item.rightIcon" />
                </span>
              </Component>

              <div class="sub-menu drop-down-menu custom-scrollbar">
                <ul>
                  <li
                    v-for="(subItem, indexItem) in item.subSection"
                    :key="indexItem"
                    class="drop-down-menu-item"
                  >
                    <a :href="subItem.src" target="_blank" class="drop-down-menu-item-content">
                      {{ subItem.label }}
                    </a>
                  </li>
                </ul>
              </div>
            </li>
          </ul>
        </div>
      </Transition>
    </div>
  </div>
</template>

<script setup lang="ts">
import LpiLoader from '~/components/base/loader/LpiLoader.vue'
import IconImage from '~/components/base/media/IconImage.vue'

import type { IconImageChoice } from '~/functs/IconImage'
import type { RouteLocationRaw } from 'vue-router'
import type { StyleValue } from 'vue'

type MenuItem = {
  to?: RouteLocationRaw
  dataTest?: string
  leftIcon?: IconImageChoice
  rightIcon?: IconImageChoice
  label: string
  action?: boolean
  subSection: { src: string; label: string }[]
}

withDefaults(
  defineProps<{
    label?: string
    icon?: IconImageChoice
    roundedIcon?: boolean
    menuItems?: MenuItem[]
    hasSeparator?: boolean
    customStyle?: StyleValue

    isLoading?: boolean
    dataTest?: string
  }>(),
  {
    label: null,
    icon: null,
    roundedIcon: false,
    menuItems: () => [],
    hasSeparator: false,
    customStyle: null,
    isLoading: false,
    dataTest: 'user-dropdown-menu',
  }
)

const open = ref(false)
const roundCorner = ref(false)
const clampCorner = ref(false)
const displaySubMenu = ref(false)

const dropDownRef = useTemplateRef('dropDown')

const getComponent = (item: MenuItem) => {
  if (item.to) {
    return resolveComponent('NuxtLink')
  }
  if (item.action) {
    return 'button'
  }
  return 'p'
}

watch(open, (neo) => {
  if (neo) {
    nextTick(() => {
      const menu = dropDownRef.value.querySelector('.drop-down-menu')
      if (menu) {
        const menuBbox = menu.getBoundingClientRect()
        const wrapperBbox = dropDownRef.value.getBoundingClientRect()
        // round corner if drop down is wider than wrapper plus border radius
        roundCorner.value =
          menuBbox.width > wrapperBbox.width + 6 /* variables.$border-radius-s: 6px;*/
        // clamp corner if drop down is wider than wrapper but not enough to have round corner
        clampCorner.value = menuBbox.width > wrapperBbox.width && !roundCorner.value
      }
    })
  }
})

const toggle = () => {
  open.value = !open.value
  // reset clampCorner so it doesnt interfere with size calculation in watcher
  clampCorner.value = false
}

const close = () => {
  open.value = false
}

const menuAction = (item) => {
  if (item.action) item.action()

  if (item.hasSubSection) displaySubMenu.value = !displaySubMenu.value

  if (!item.hasSubSection) close()
}
</script>

<style lang="scss" scoped>
@use '~/design/scss/variables';

.header-drop-down {
  position: relative;

  button {
    background-color: transparent;
    border: 0 none;
  }

  .caret {
    margin-left: variables.$space-s;
  }

  .caret svg {
    fill: variables.$primary-dark;
    width: 100%;
  }

  &.is-open .caret svg {
    fill: variables.$white;
  }

  .drop-down-toggle {
    display: flex;
    justify-content: center;
    align-items: center;
    padding: variables.$space-m variables.$space-l;
    font-weight: 700;
    font-size: variables.$font-size-m;
    transition: 0.15s all ease-in-out;
    cursor: pointer;
    will-change: transform;
    overflow: hidden;
    height: variables.pxtorem(56px);
    color: variables.$primary-dark;
    text-transform: uppercase;
    border-top-left-radius: variables.$border-radius-s;
    border-top-right-radius: variables.$border-radius-s;

    .icon {
      fill: variables.$primary-dark;
      margin-right: variables.$space-s;
      width: variables.pxtorem(18px);

      &.rounded {
        fill: variables.$white;
        background-color: variables.$primary-dark;
        border-radius: variables.pxtorem(9px);
      }
    }
  }

  &.is-open .drop-down-toggle {
    background-color: variables.$primary-dark;
    color: variables.$white;

    .icon {
      fill: variables.$white;

      &.rounded {
        fill: variables.$primary-dark;
        background-color: variables.$white;
      }
    }
  }

  .drop-down-menu-wrapper {
    position: absolute;
    right: 1px;
    min-width: 100%;
    transform: scale3d(1, 1, 1); // fix rounding pixel width issue
    margin-top: -1px; // fix pixel rounding issue on zoomed scrren

    &.clamp-corner {
      // "invisible" 6px clamping if not enough space to accomodate the top right border radius
      right: 0;
      width: 100%;
    }
  }

  .drop-down-menu {
    background-color: variables.$primary-dark;
    padding-bottom: variables.$border-radius-l;
    border-bottom-left-radius: variables.$border-radius-l;
    border-bottom-right-radius: variables.$border-radius-l;
    max-height: variables.pxtorem(450px);

    &.round-corner {
      border-top-left-radius: variables.$border-radius-s;
    }

    .drop-down-menu-item {
      padding: 0 variables.$space-l;
      position: relative;

      .drop-down-menu-item-content {
        color: variables.$white;
        padding: variables.$space-m 0;
        font-weight: 700;
        font-size: variables.$font-size-s;
        display: flex;
        align-items: center;

        .menu-icon {
          &.left-icon {
            margin-right: variables.$space-s;
          }

          &.right-icon {
            margin-left: variables.$space-s;
          }

          svg {
            width: variables.pxtorem(16px);
            fill: variables.$white;
            transform-origin: right center;
          }
        }

        .label {
          transform-origin: left center;
          white-space: nowrap;
        }

        .label,
        .menu-icon svg {
          transform: translateZ(0);
          transition: transform 200ms ease-in-out;
        }
      }

      &:hover {
        .drop-down-menu-item-content {
          .label {
            color: variables.$primary-light;
            transform: translateZ(0) scaleX(1.1);
          }

          svg {
            fill: variables.$primary-light;
            transform: translateZ(0) scale(1.35);
          }
        }
      }

      &:hover .sub-menu {
        display: block;
      }

      button {
        cursor: pointer;
      }
    }

    .sub-menu {
      position: absolute;
      display: none;
      left: 100%;
      top: 5px;
      background: variables.$primary-dark;
      border-radius: variables.$border-radius-s variables.$border-radius-s
        variables.$border-radius-l variables.$border-radius-l;
      padding-bottom: 21px;
      color: variables.$white;
      overflow-y: auto;
    }

    &.has-separator {
      .drop-down-menu-item ~ .drop-down-menu-item {
        border-top: variables.$border-width-m solid variables.$white;
      }
    }

    .drop-down-menu-item:last-child button {
      padding-bottom: 0;
    }

    .loader {
      margin-left: auto;
      margin-right: auto;
      width: max-content;
      margin-top: variables.$space-l;
    }
  }
}

.menu-fade-leave-active,
.menu-fade-enter-active {
  transform: translateY(0);
  transition:
    0.15s transform ease-in-out,
    0.1s border-top-right-radius ease-in-out 0.05s,
    0.1s opacity ease-in-out 0.05s;
}

.menu-fade-enter-from,
.menu-fade-leave-to {
  opacity: 0;
  transform: translateY(-100%);
}

.label-and-icon {
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;

  &::after {
    content: '';
    position: absolute;
    left: 0;
    right: 0;
    height: variables.pxtorem(6px);
    background-color: variables.$primary-dark;
    bottom: variables.pxtorem(-6px);
    transform: translateZ(0) scale(0);
    transition: transform 0.15s ease-in-out;
  }

  &:hover::after {
    transform: translateZ(0) scale(1);
  }
}
</style>
