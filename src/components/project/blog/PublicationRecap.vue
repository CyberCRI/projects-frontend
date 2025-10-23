<template>
  <div :class="isBlog ? 'is-blog' : 'is-comment'" class="publication-recap">
    <div class="publication-header">
      <SectionHeader
        :button-label="capitalize($t('common.see-more'))"
        :quantity="publications.length"
        :title="capitalize(isBlog ? $t('blog.posts') : $t('comment.comments'))"
        @redirect-button-clicked="redirectToPage"
      />
    </div>

    <div class="publication-body custom-scrollbar">
      <div class="publication-meta">
        <span class="date">{{ $d(new Date(lastPublication.updated_at)) }}</span>
      </div>
      <h3 class="publication-title">
        <span v-if="isBlog">{{ lastPublication?.$t?.title }}</span>
        <span v-else class="author">
          <span>{{ lastPublication.author.given_name }}</span>
          &nbsp;
          <span>{{ lastPublication.author.family_name }}</span>
        </span>
      </h3>

      <TipTapOutput class="publication-content" :content="lastPublication?.$t?.content" />
    </div>
  </div>
</template>

<script setup>
import { capitalize } from '@/functs/string'

import SectionHeader from '@/components/base/SectionHeader.vue'
import TipTapOutput from '@/components/base/form/TextEditor/TipTapOutput.vue'

defineOptions({ name: 'PublicationRecap' })
const router = useRouter()
const route = useRoute()

const props = defineProps({
  isBlog: {
    type: Boolean,
    default: true,
  },
  publications: {
    type: Array,
    required: true,
  },
})

const lastPublication = computed(() => {
  return props.publications.reduce((mostRecent, publication) =>
    new Date(mostRecent.updated_at) > new Date(publication.updated_at) ? mostRecent : publication
  )
})

const redirectToPage = () => {
  const routeName = props.isBlog ? 'projectBlog' : 'projectComments'
  router.push({
    name: routeName,
    params: { slugOrId: route.params.slugOrId },
    hash: '#tab',
  })
}
</script>

<style lang="scss" scoped>
.publication-recap {
  overflow: hidden;
  border-radius: $border-radius-l;
  border: $border-width-s solid $primary;
  box-sizing: border-box;
  background: $white;
  max-height: pxToRem(380px);
  display: flex;
  flex-flow: column;

  .publication-header {
    display: flex;
    color: $primary-dark;
    flex-shrink: 0;
    padding: $space-l 0;

    .header-main {
      padding: $space-m $space-l;
      width: 100%;
      display: flex;
      align-items: flex-start;
      font-weight: 700;
    }

    .know-more-button {
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 0 $space-l;
      text-transform: uppercase;
      font-weight: 700;
      font-size: $font-size-2xs;
      cursor: pointer;
      white-space: nowrap;
      position: relative;
      transition: 0.15s all ease-in-out;
      overflow: hidden;
      will-change: transform;

      svg {
        width: 18px;
        height: 18px;
        fill: $primary-dark;
        margin-left: $space-s;
      }

      &::after {
        content: '';
        position: absolute;
        left: 0;
        top: 0;
        height: 100%;
        width: 100%;
        transform: translate(-101%, 0);
        transform-origin: left;
        transition: 0.15s all ease-in-out;
        will-change: transform;
        z-index: -1;
        background: $primary;
      }

      &:hover {
        color: $white;

        svg {
          fill: $white;
        }

        &::after {
          transform: translate(0, 0);
        }
      }
    }

    @media screen and (max-width: $max-mobile) {
      .know-more-button svg {
        display: none;
      }
    }
  }

  .last-publication-flag {
    background: $primary-light;
    color: $primary-dark;
    text-transform: uppercase;
    display: flex;
    flex-shrink: 0;
    align-items: center;
    justify-content: center;
    font-weight: 700;
    font-size: $font-size-2xs;
    padding: $space-s 0;
  }

  .publication-body {
    padding: $space-m 0;
    flex-grow: 1;
    overflow: hidden auto;
    margin-right: $space-2xs;

    .publication-meta {
      flex-shrink: 0;

      .date {
        color: $primary-dark;
        font-size: $font-size-xs;
        font-weight: 700;
      }
    }

    .publication-title {
      font-size: $font-size-m;
      font-weight: 700;
      border-bottom: $border-width-m solid $primary;
      padding-bottom: $space-m;
      margin-bottom: $space-m;
      margin-top: $space-m;
      color: $almost-black;
      flex-shrink: 0;

      .author span:last-of-type {
        text-transform: uppercase;
      }
    }

    .publication-content {
      color: $almost-black;
      position: relative;
      flex-grow: 1;
      overflow: hidden;

      .gradient {
        position: absolute;
        opacity: 1;
        transition: opacity 0.8s ease-in-out;
        top: 0;
        left: 0;
        height: 100%;
        width: 100%;
        background: linear-gradient(
          180deg,
          rgb(255 255 255 / 0%) 0%,
          rgb(255 255 255 / 10%) 70%,
          rgb(255 255 255 / 85%) 85%,
          rgb(255 255 255) 100%
        );
        pointer-events: none;
      }

      .angle-down-icon {
        height: 12px;
        fill: $primary-dark;
        position: absolute;
        bottom: 0;
        left: 50%;
        transform: translateX(-50%);
      }

      p {
        margin-bottom: $space-s;
      }
    }
  }

  &.is-blog {
    .publication-title {
      margin-top: $space-s;
    }
  }
}
</style>
