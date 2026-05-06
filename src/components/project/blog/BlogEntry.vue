<template>
  <div class="blog-entry" :class="{ 'shadow-box': !stateModal }">
    <div class="blog-entry-header">
      <div class="header-main">
        <div class="entry-title skeletons-text">
          {{ blogEntry.$t.title }}
        </div>

        <div class="date skeletons-text">
          {{ $d(new Date(blogEntry.created_at)) }}
        </div>
      </div>

      <div class="expand-button skeletons-background" @click="toggleModal">
        <span>{{ stateModal ? $t('common.shrink') : $t('common.read') }}</span>

        <IconImage v-if="stateModal" name="ChevronUp" />
        <IconImage v-else name="ChevronDown" />
      </div>
    </div>

    <div v-if="stateModal && isLastBlogEntry" class="last-publication-flag skeletons-text">
      {{ $t('blog.last-publication') }}
    </div>

    <ContentExpandable
      class="skeletons-text"
      :height-limit="stateModal ? 10000000000 : 0"
      hide-see-more
    >
      <div class="entry-body">
        <TipTapOutput
          class="description tiptap-output skeletons-text"
          :content="blogEntry.$t.content"
        />
      </div>
    </ContentExpandable>

    <div
      v-if="canEdit || canDelete"
      :class="{ 'button-ctn--expanded': stateModal }"
      class="button-ctn skeletons-background"
    >
      <ContextActionButton
        v-if="canEdit"
        class="button small"
        action-icon="Pen"
        @click="$emit('edit')"
      />
      <ContextActionButton
        v-if="canDelete"
        class="button small"
        action-icon="TrashCanOutline"
        @click="$emit('delete')"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import type { TranslatedBlogEntry } from '~/models/blog-entry.model'

import ContextActionButton from '~/components/base/button/ContextActionButton.vue'
import TipTapOutput from '~/components/base/form/TextEditor/TipTapOutput.vue'
import IconImage from '~/components/base/media/IconImage.vue'

const props = withDefaults(
  defineProps<{
    blogEntry: TranslatedBlogEntry
    isLastBlogEntry?: boolean
    expanded?: boolean
    canEdit?: boolean
    canDelete?: boolean
  }>(),
  {
    isLastBlogEntry: false,
    expanded: false,
    canEdit: false,
    canDelete: false,
  }
)

const emit = defineEmits<{
  edit: []
  delete: []
  expanded: [boolean]
}>()

const { stateModal, toggleModal, openModal, closeModal } = useModal(props.expanded)

watch(stateModal, () => emit('expanded', stateModal.value))

watch(
  () => props.expanded,
  (val) => {
    if (val) {
      openModal()
    } else {
      closeModal()
    }
  }
)
</script>

<style lang="scss" scoped>
.blog-entry {
  border-radius: $border-radius-l;
  border: $border-width-s solid var(--primary);
  box-sizing: border-box;
  background: var(--white);
  position: relative;

  .blog-entry-header {
    display: flex;
    color: var(--primary-dark);

    .header-main {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: $space-m $space-l;
      font-weight: 700;
      width: 100%;

      .entry-title {
        font-size: $font-size-m;
        line-height: $line-height-tight;
      }

      .date {
        font-size: $font-size-xs;
      }
    }

    .expand-button {
      border-left: $border-width-s solid var(--primary);
      display: flex;
      align-items: center;
      padding: 0 $space-l;
      text-transform: uppercase;
      font-weight: 700;
      font-size: $font-size-2xs;
      cursor: pointer;
      flex-basis: pxToRem(75px);
      justify-content: space-between;

      svg {
        height: 18px;
        fill: var(--primary-dark);
      }
    }
  }

  .last-publication-flag {
    border-top: $border-width-s solid var(--primary);
    background: $primary-light;
    color: var(--primary-dark);
    text-transform: uppercase;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: 700;
    font-size: $font-size-2xs;
    padding: $space-s 0;
  }

  .entry-body {
    border-top: $border-width-s solid var(--primary);
    padding: $space-m $space-l;

    &::after {
      // fix floated image overflow
      content: '';
      display: block;
      clear: both;
    }
  }

  .button-ctn {
    position: absolute;
    top: 0;
    right: 110px;
    display: flex;
    transform: translateY(-60%);

    .button {
      margin: 0 4px;
    }

    svg {
      width: 12px;
      height: 12px;
      fill: var(--primary-dark);
    }
  }
}
</style>
