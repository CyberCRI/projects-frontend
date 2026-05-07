<template>
  <div class="resource-wrapper">
    <div
      :class="{ 'h-reverse': horizontalReverse }"
      class="resource-card shadow-box"
      @click="openResource"
    >
      <div v-if="icon" class="icon-ctn">
        <IconImage :name="icon" class="icon skeletons-background" />
      </div>

      <div class="content">
        <span class="resource-title skeletons-text">{{ title }}</span>
        <span class="resource-subtitle skeletons-text">{{ subtitle }}</span>
      </div>
    </div>
    <div v-if="canEdit || canDelete" class="actions-ctn">
      <ContextActionButton
        v-if="canEdit"
        class="small skeletons-background"
        action-icon="Pen"
        @click="$emit('edit-clicked')"
      />
      <ContextActionButton
        v-if="canDelete"
        class="small skeletons-background"
        action-icon="Close"
        @click="$emit('delete-clicked')"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import ContextActionButton from '~/components/base/button/ContextActionButton.vue'
import IconImage from '~/components/base/media/IconImage.vue'

import type { IconImageChoice } from '~/functs/IconImage'

const props = withDefaults(
  defineProps<{
    title: string
    subtitle?: string
    resource?: any
    canEdit?: boolean
    canDelete?: boolean
    horizontalReverse?: boolean
    icon?: IconImageChoice
  }>(),
  {
    subtitle: '',
    resource: null,
    canEdit: false,
    canDelete: false,
    horizontalReverse: false,
    icon: null,
  }
)

defineEmits<{
  'delete-clicked': []
  'edit-clicked': []
}>()

const openResource = () => {
  if (['file', 'image'].includes(props.resource.attachment_type)) {
    window.open(props.resource.file, '_blank')
  } else {
    //'link', 'video'...
    window.open(props.resource.site_url, '_blank')
  }
}
</script>

<style lang="scss" scoped>
.resource-wrapper {
  width: 100%;
  position: relative;

  .actions-ctn {
    position: absolute;
    top: 0;
    right: 0;
    transform: translateY(-50%);
    display: flex;

    button:last-of-type {
      margin-left: $space-s;
    }
  }

  .resource-card {
    border: $border-width-s solid var(--primary);
    border-radius: $border-radius-m;
    display: flex;
    cursor: pointer;
    height: 96px;
    overflow: hidden;
    position: relative;

    &.h-reverse {
      flex-direction: row-reverse;

      .icon-ctn {
        border-left: 1px solid var(--primary);
        border-right: unset;
      }
    }

    &:hover .content {
      background-color: var(--primary-lighter);
    }

    .icon-ctn {
      background: var(--primary);
      border-right: 1px solid var(--primary);
      padding: $space-l;
      display: flex;
      justify-content: center;
      align-items: center;
      position: relative;

      > svg {
        width: 30px;
        max-height: 100%;
        fill: var(--white);
      }
    }

    .content {
      background-color: var(--white);
      font-size: $font-size-m;
      padding: $space-s pxToRem(18px);
      margin-right: auto;
      transition: background-color 0.3s ease-in-out;
      overflow: hidden;
      flex-grow: 1;

      .resource-title {
        font-weight: bold;
        display: -webkit-box;
        -webkit-line-clamp: 1;
        -webkit-box-orient: vertical;
        overflow: hidden;
        word-wrap: break-word;
      }

      .resource-subtitle {
        font-size: $font-size-s;
        line-height: $line-height-tight;
        display: -webkit-box;
        -webkit-line-clamp: 3;
        -webkit-box-orient: vertical;
        overflow: hidden;
        margin-top: $space-s;
        word-wrap: break-word;
      }

      span {
        display: block;
      }
    }

    .button-ctn {
      position: absolute;
      top: -8px;
      right: 17px;
      display: flex;

      .svg-wrapper {
        padding: $space-2xs;
        background: var(--primary-lighter);
        border-radius: 100%;
        border: $border-width-s solid var(--primary);
        width: 20px;
        height: 20px;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;

        svg {
          width: 12px;
          height: 12px;
          fill: var(--primary-dark);
        }

        &:nth-child(2) {
          margin-left: $space-2xs;
        }
      }
    }
  }
}
</style>
