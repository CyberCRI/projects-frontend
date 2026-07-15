<script setup lang="ts">
import useSectionFilters, { ALL_SECTION_KEY } from '~/components/search/Filters/useSectionFilters'
import LpiLoader from '~/components/base/loader/LpiLoader.vue'
import IconImage from '~/components/base/media/IconImage.vue'

const selectedSection = defineModel<string>('selectedSection', {
  default: ALL_SECTION_KEY,
})

const { sectionFilters } = useSectionFilters({ selectedSection })

withDefaults(
  defineProps<{
    hasSeparator?: boolean
    isLoading?: boolean
  }>(),
  {
    hasSeparator: false,
    isLoading: false,
  }
)

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
@use '~/design/scss/variables';

.header-drop-down {
  position: relative;
  margin-bottom: variables.$space-m;
  width: 100%;

  @media (min-width: variables.$min-tablet) {
    margin-bottom: 0;
    width: auto;
  }

  button {
    border: 0 none;
  }

  .caret {
    margin-left: variables.$space-l;
    fill: variables.$primary-dark;
    width: variables.pxToRem(20px);
  }

  .drop-down-toggle {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: variables.pxToRem(10px) variables.$space-l;
    font-weight: 700;
    font-size: variables.$font-size-m;
    transition: 0.15s all ease-in-out;
    cursor: pointer;
    will-change: transform;
    overflow: hidden;
    min-width: variables.pxToRem(250px);
    color: variables.$primary-dark;
    background: variables.$white;
    border-radius: variables.$border-radius-24;
    box-shadow: 0 0 0 1px variables.$primary;
    width: 100%;

    .icon {
      fill: variables.$primary-dark;
      margin-right: variables.$space-s;
      width: variables.pxToRem(18px);
    }

    @media (min-width: variables.$min-tablet) {
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
    color: variables.$primary-dark;

    .icon {
      fill: variables.$primary-dark;
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
    background-color: variables.$white;
    padding-bottom: variables.$border-radius-l;
    border-radius: variables.$border-radius-l;
    max-height: variables.pxToRem(450px);
    overflow: hidden auto;
    border: 1px solid variables.$primary;
    box-shadow: 0 4px 4px rgb(0 0 0 / 15%);

    @media (min-width: variables.$min-tablet) {
      border-bottom-right-radius: 0;
      border-top-right-radius: 0;
    }

    &.round-corner {
      border-top-right-radius: variables.$border-radius-s;
    }

    .drop-down-menu-item {
      margin: variables.$space-s;

      .drop-down-menu-item-content {
        color: variables.$primary-dark;
        padding: variables.$space-xs;
        font-weight: 700;
        font-size: variables.$font-size-s;
        display: flex;
        align-items: center;
        background: transparent;
        width: 100%;

        &--selected {
          background: variables.$primary-light;
          border-radius: variables.$border-radius-xs;
        }

        .menu-icon {
          &.left-icon {
            margin-right: variables.$space-s;
          }

          &.right-icon {
            margin-left: variables.$space-s;
          }

          svg {
            width: variables.pxToRem(16px);
            fill: variables.$primary-dark;
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
        border-top: variables.$border-width-m solid variables.$white;
      }
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
