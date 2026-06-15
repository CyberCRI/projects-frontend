<template>
  <component :is="to ? NuxtLink : 'div'" class="blog-entry" :to="to">
    <div class="blog-entry-header">
      <div class="header-main">
        <div class="entry-title skeletons-text">
          {{ blogEntry.$t.title }}
        </div>

        <div class="date skeletons-text">
          {{ formatDate(blogEntry.created_at, locale) }}
        </div>
      </div>

      <div v-if="canEdit || canDelete" class="expand-button skeletons-background">
        <ContextActionMenuInline
          :can-delete="canDelete"
          :can-edit="canEdit"
          @delete="$emit('delete')"
          @edit="$emit('edit')"
        />
      </div>
    </div>

    <!-- add infinity height to only click shw -->
    <ContentExpandable
      class="skeletons-text"
      :height-limit="remToPx(4)"
      :opened="stateModal"
      @expanded="setModal($event)"
    >
      <div class="entry-body">
        <TipTapOutput
          class="description tiptap-output skeletons-text"
          :content="blogEntry.$t.content"
        />
      </div>
    </ContentExpandable>
  </component>
</template>

<script setup lang="ts">
import type { TranslatedBlogEntry } from '~/models/blog-entry.model'

import TipTapOutput from '~/components/base/form/TextEditor/TipTapOutput.vue'
import type { RouteLocationRaw } from 'vue-router'
import { formatDate } from '~/functs/date'
import { remToPx } from '~/functs/style'
import { NuxtLink } from '#components'

const props = withDefaults(
  defineProps<{
    blogEntry: TranslatedBlogEntry
    expanded?: boolean
    canEdit?: boolean
    canDelete?: boolean
    to?: RouteLocationRaw
  }>(),
  {
    expanded: false,
    canEdit: false,
    canDelete: false,
    to: null,
  }
)

const emit = defineEmits<{
  edit: []
  delete: []
  expanded: [boolean]
}>()

const { locale } = useNuxtI18n()
const { stateModal, setModal } = useModal(props.expanded)

watch(stateModal, () => emit('expanded', stateModal.value))

watch(
  () => props.expanded,
  (val) => setModal(val),
  { immediate: true }
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
      color: var(--primary-dark);

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
