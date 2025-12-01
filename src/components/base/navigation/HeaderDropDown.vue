<template>
  <div v-click-outside="close" :class="{ 'is-open': open }" class="header-drop-down">
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
                :is="item.to ? 'NuxtLink' : item.action ? 'button' : 'p'"
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

<script>
import IconImage from '@/components/base/media/IconImage.vue'
import LpiLoader from '@/components/base/loader/LpiLoader.vue'
import { NuxtLink } from '#components'

export default {
  name: 'HeaderDropDown',

  components: {
    LpiLoader,
    IconImage,
    NuxtLink,
  },

  props: {
    label: {
      type: String,
      default: null,
    },

    icon: {
      type: String,
      default: null,
    },

    roundedIcon: {
      type: Boolean,
      default: false,
    },

    menuItems: {
      type: Array,
      default: () => [],
    },

    hasSeparator: {
      type: Boolean,
      default: false,
    },

    customStyle: {
      type: Object,
      default: () => {},
    },

    isLoading: {
      type: Boolean,
      default: false,
    },
    dataTest: {
      type: String,
      default: 'user-dropdown-menu',
    },
  },

  data() {
    return {
      open: false,
      roundCorner: false,
      clampCorner: false,
      displaySubMenu: false,
    }
  },

  watch: {
    open(neo) {
      if (neo) {
        this.$nextTick(() => {
          const menu = this.$el.querySelector('.drop-down-menu')
          if (menu) {
            const menuBbox = menu.getBoundingClientRect()
            const wrapperBbox = this.$el.getBoundingClientRect()
            // round corner if drop down is wider than wrapper plus border radius
            this.roundCorner = menuBbox.width > wrapperBbox.width + 6 /* $border-radius-s: 6px;*/
            // clamp corner if drop down is wider than wrapper but not enough to have round corner
            this.clampCorner = menuBbox.width > wrapperBbox.width && !this.roundCorner
          }
        })
      }
    },
  },

  methods: {
    toggle() {
      this.open = !this.open
      // reset clampCorner so it doesnt interfere with size calculation in watcher
      this.clampCorner = false
    },

    close() {
      this.open = false
    },

    menuAction(item) {
      if (item.action) item.action()

      if (item.hasSubSection) this.displaySubMenu = !this.displaySubMenu

      if (!item.hasSubSection) this.close()
    },
  },
}
</script>

<style lang="scss" scoped>
.header-drop-down {
  position: relative;

  button {
    background-color: transparent;
    border: 0 none;
  }

  .caret {
    margin-left: $space-s;
  }

  .caret svg {
    fill: $primary-dark;
    width: 100%;
  }

  &.is-open .caret svg {
    fill: $white;
  }

  .drop-down-toggle {
    display: flex;
    justify-content: center;
    align-items: center;
    padding: $space-m $space-l;
    font-weight: 700;
    font-size: $font-size-m;
    transition: 0.15s all ease-in-out;
    cursor: pointer;
    will-change: transform;
    overflow: hidden;
    height: pxToRem(56px);
    color: $primary-dark;
    text-transform: uppercase;
    border-top-left-radius: $border-radius-s;
    border-top-right-radius: $border-radius-s;

    .icon {
      fill: $primary-dark;
      margin-right: $space-s;
      width: pxToRem(18px);

      &.rounded {
        fill: $white;
        background-color: $primary-dark;
        border-radius: pxToRem(9px);
      }
    }
  }

  &.is-open .drop-down-toggle {
    background-color: $primary-dark;
    color: $white;

    .icon {
      fill: $white;

      &.rounded {
        fill: $primary-dark;
        background-color: $white;
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
    background-color: $primary-dark;
    padding-bottom: $border-radius-l;
    border-bottom-left-radius: $border-radius-l;
    border-bottom-right-radius: $border-radius-l;
    max-height: pxToRem(450px);

    &.round-corner {
      border-top-left-radius: $border-radius-s;
    }

    .drop-down-menu-item {
      padding: 0 $space-l;
      position: relative;

      .drop-down-menu-item-content {
        color: $white;
        padding: $space-m 0;
        font-weight: 700;
        font-size: $font-size-s;
        display: flex;
        align-items: center;

        .menu-icon {
          &.left-icon {
            margin-right: $space-s;
          }

          &.right-icon {
            margin-left: $space-s;
          }

          svg {
            width: pxToRem(16px);
            fill: $white;
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
            color: $primary-light;
            transform: translateZ(0) scaleX(1.1);
          }

          svg {
            fill: $primary-light;
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
      background: $primary-dark;
      border-radius: $border-radius-s $border-radius-s $border-radius-l $border-radius-l;
      padding-bottom: 21px;
      color: $white;
      overflow-y: auto;
    }

    &.has-separator {
      .drop-down-menu-item ~ .drop-down-menu-item {
        border-top: $border-width-m solid $white;
      }
    }

    .drop-down-menu-item:last-child button {
      padding-bottom: 0;
    }

    .loader {
      margin-left: auto;
      margin-right: auto;
      width: max-content;
      margin-top: $space-l;
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
    height: pxToRem(6px);
    background-color: $primary-dark;
    bottom: pxToRem(-6px);
    transform: translateZ(0) scale(0);
    transition: transform 0.15s ease-in-out;
  }

  &:hover::after {
    transform: translateZ(0) scale(1);
  }
}
</style>
