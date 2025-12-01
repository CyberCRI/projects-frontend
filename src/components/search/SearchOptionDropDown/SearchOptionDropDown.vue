<script setup>
import IconImage from '@/components/base/media/IconImage.vue'
import LpiLoader from '@/components/base/loader/LpiLoader.vue'
import useSectionFilters from '@/components/search/Filters/useSectionFilters.ts'
import { ref } from 'vue'

const selectedSection = defineModel('selectedSection', {
  type: String,
  default: () => ALL_SECTION_KEY,
})

const { sectionFilters } = useSectionFilters({ selectedSection })

defineProps({
  hasSeparator: {
    type: Boolean,
    default: false,
  },

  isLoading: {
    type: Boolean,
    default: false,
  },
})

const open = ref(false)

function toggle() {
  open.value = !open.value
}

function close() {
  open.value = false
}

function menuAction(key) {
  selectedSection.value = key
  close()
}
</script>
<template>
  <div v-click-outside="close" :class="{ 'is-open': open }" class="header-drop-down">
    <button class="drop-down-toggle" data-test="drop-down-menu" @click="toggle">
      <slot :open="open">
        <span class="label-ctn">
          <slot name="badge" />
          <IconImage
            v-if="sectionFilters[selectedSection]?.leftIcon"
            :name="sectionFilters[selectedSection]?.leftIcon"
            class="icon"
          />

          <span v-if="sectionFilters[selectedSection]?.label" class="drop-down-label">
            {{ sectionFilters[selectedSection]?.label }}
          </span>
        </span>
        <IconImage class="caret" :name="open ? 'ChevronUp' : 'ChevronDown'" />
      </slot>
    </button>
    <div class="drop-down-menu-wrapper">
      <Transition name="menu-fade">
        <div
          v-if="open"
          :class="{
            'has-separator': hasSeparator,
          }"
          class="drop-down-menu custom-scrollbar"
        >
          <LpiLoader v-if="isLoading" class="loader" type="simple" />

          <ul v-else>
            <li />
            <li
              v-for="(item, key) in sectionFilters"
              :key="key"
              class="drop-down-menu-item"
              :data-test="item.dataTest"
            >
              <button
                class="drop-down-menu-item-content"
                :class="{
                  'drop-down-menu-item-content--selected': selectedSection === key,
                }"
                @click="menuAction(key)"
              >
                <span v-if="item.leftIcon" class="menu-icon left-icon">
                  <IconImage :name="item.leftIcon" />
                </span>
                <span class="label">{{ item.label }}</span>
                <span v-if="item.rightIcon" class="menu-icon right-icon">
                  <IconImage :name="item.rightIcon" />
                </span>
              </button>
            </li>
          </ul>
        </div>
      </Transition>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.header-drop-down {
  position: relative;
  margin-bottom: $space-m;
  width: 100%;

  @media (min-width: $min-tablet) {
    margin-bottom: 0;
    width: auto;
  }

  button {
    border: 0 none;
  }

  .caret {
    margin-left: $space-l;
    fill: $primary-dark;
    width: pxToRem(20px);
  }

  .drop-down-toggle {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: pxToRem(10px) $space-l;
    font-weight: 700;
    font-size: $font-size-m;
    transition: 0.15s all ease-in-out;
    cursor: pointer;
    will-change: transform;
    overflow: hidden;
    min-width: pxToRem(250px);
    color: $primary-dark;
    background: $white;
    border-radius: $border-radius-24;
    box-shadow: 0 0 0 1px $primary;
    width: 100%;

    .icon {
      fill: $primary-dark;
      margin-right: $space-s;
      width: pxToRem(18px);
    }

    @media (min-width: $min-tablet) {
      border-top-right-radius: 0;
      border-bottom-right-radius: 0;
      border-right: none;
      width: auto;
    }

    .label-ctn {
      display: inherit;
    }
  }

  &.is-open .drop-down-toggle {
    color: $primary-dark;

    .icon {
      fill: $primary-dark;
    }
  }

  .drop-down-menu-wrapper {
    position: absolute;
    top: 40px; // button size + 5px margin
    right: 0; // to align with border
    min-width: 100%;
    transform: scale3d(1, 1, 1); // fix rounding pixel width issue
    z-index: 1;
  }

  .drop-down-menu {
    background-color: $white;
    padding-bottom: $border-radius-l;
    border-radius: $border-radius-l;
    max-height: pxToRem(450px);
    overflow: hidden auto;
    border: 1px solid $primary;
    box-shadow: 0 4px 4px rgb(0 0 0 / 15%);

    @media (min-width: $min-tablet) {
      border-bottom-right-radius: 0;
      border-top-right-radius: 0;
    }

    &.round-corner {
      border-top-right-radius: $border-radius-s;
    }

    .drop-down-menu-item {
      margin: $space-s;

      .drop-down-menu-item-content {
        color: $primary-dark;
        padding: $space-xs;
        font-weight: 700;
        font-size: $font-size-s;
        display: flex;
        align-items: center;
        background: transparent;
        width: 100%;

        &--selected {
          background: $primary-light;
          border-radius: $border-radius-xs;
        }

        .menu-icon {
          &.left-icon {
            margin-right: $space-s;
          }

          &.right-icon {
            margin-left: $space-s;
          }

          svg {
            width: pxToRem(16px);
            fill: $primary-dark;
            transform-origin: right center;
          }
        }

        .label {
          transform-origin: left center;
        }

        .label,
        .menu-icon svg {
          transition: transform 200ms ease-in-out;
          transform: translateZ(0);
        }
      }

      &:hover {
        .drop-down-menu-item-content {
          .label {
            transform: translateZ(0) scaleX(1.1);
          }

          svg {
            transform: translateZ(0) scale(1.35);
          }
        }
      }

      button {
        cursor: pointer;
      }
    }

    &.has-separator {
      .drop-down-menu-item ~ .drop-down-menu-item {
        border-top: $border-width-m solid $white;
      }
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
    0.1s border-top-right-radius ease-in-out 0.05s;
}

.menu-fade-enter,
.menu-fade-leave-to {
  opacity: 0;
  transform: translateY(-100%);
}

.drop-down-label {
  white-space: nowrap;
}
</style>
