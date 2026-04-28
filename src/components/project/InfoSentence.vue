<template>
  <div
    v-if="(data.number && data.number > 0) || !data.number"
    class="info-sentence"
    :class="[
      {
        'all-bold': allBold,
        'all-plain': allPlain,
        flow: flow,
        inline: inline,
        black: black,
        cloud: data.cloud,
      },
    ]"
  >
    <div class="first-part">
      <img v-if="data.cloud" class="icon" :class="size" :src="iconSrc" />
      <IconImage v-else class="icon" :name="data.icon" />
      <div class="text">
        <div v-if="data.info1" class="no-badge">
          <span class="title">
            {{ $t(data.title) }}
          </span>
          <span>:&nbsp;</span>
          <span v-for="(item, index) in data.info1" :key="index" class="info">
            {{ item }}
          </span>
          <span v-if="data.title2" class="info">&nbsp; - &nbsp;</span>
          <span v-if="data.title2">{{ $t(data.title2) }}</span>
          <span v-if="data.info2">:&nbsp;</span>
          <span v-if="data.info2" class="info">{{ data.info2 }}</span>
          <span v-if="data.title3" class="info">&nbsp; - &nbsp;</span>
        </div>
        <div v-else>
          <span v-if="data.preTitle" class="title">
            {{ $t(data.preTitle) + data.number + $t(data.title) }}
            <span>: &nbsp;</span>
          </span>
          <span v-else-if="data.number" class="title">
            {{ data.number + $t(data.title) }}
            <span>: &nbsp;</span>
          </span>
          <span v-else-if="data.title" class="title">
            {{ $t(data.title) }}
          </span>
        </div>
      </div>
    </div>
    <div class="second-part">
      <div v-if="data.info && data.badge" class="tag-list-desktop">
        <TagsList
          :key="'desktop' + count"
          :info-tags="data.info"
          class="tag-list"
          prefix="desktop"
          :internal="data.internal"
          :to="{
            name: 'ProjectSearch',
            query: {
              section: 'projects',
            },
          }"
        />
      </div>
      <span v-if="data.title3">{{ $t(data.title3) }}</span>
      <span v-if="data.info3">:&nbsp;</span>
      <span v-if="data.info3" class="info">{{ data.info3 }}</span>
    </div>
  </div>
</template>

<script setup lang="ts">
// TODO need to change this whole things (wtf components)
import type { TagModel } from '~/models/tag.model'

import IconImage from '~/components/base/media/IconImage.vue'
import TagsList from '~/components/tags/TagsList.vue'

import { usePublicURL } from '~/composables/usePublic'

import type { IconImageChoice } from '~/functs/IconImage'

type Data = {
  number?: number
  icon?: IconImageChoice
  cloud?: boolean
  preTitle?: string
  internal?: boolean

  info?: TagModel[]
  info1?: string
  info2?: string
  info3?: string

  title?: string
  title2?: string
  title3?: string

  badge?: string
}

const props = withDefaults(
  defineProps<{
    data?: Data
    count?: number
    allBold?: boolean
    allPlain?: boolean
    flow?: boolean
    inline?: boolean
    black?: boolean
    size?: string
  }>(),
  {
    data: null,
    count: 0,
    allBold: false,
    allPlain: false,
    flow: false,
    inline: false,
    black: false,
    size: null,
  }
)

const iconSrc = computed(() => usePublicURL(props.data.icon || ''))
</script>

<style lang="scss" scoped>
.info-sentence {
  display: flex;
  align-items: center;

  span,
  a {
    font-size: $font-size-s;
    font-weight: 400;
    color: $primary-dark;
    align-self: center;
  }

  &.all-bold {
    span,
    a {
      font-weight: 700;
    }
  }

  &.all-plain {
    span,
    a {
      font-weight: 400;
    }
  }

  &.black {
    span {
      color: $black;
    }
  }

  .info {
    font-weight: 700;
    align-self: center;
  }

  .clickable {
    cursor: pointer;

    &:hover {
      filter: brightness(1.2);
    }
  }

  .first-part {
    display: flex;
    flex-direction: row;
    align-items: center;

    .text {
      display: flex;
      width: 100%;

      .title {
        width: fit-content;
      }

      .no-badge {
        display: flex;
        flex-direction: row;
        align-items: center;
      }
    }
  }

  .second-part {
    display: flex;
    flex-direction: row;
    width: 30%;
    flex-grow: 1;
  }

  .tag-list-desktop {
    width: 100%;
    flex-grow: 1;
  }

  .icon {
    margin-right: $space-s;
    height: pxToRem(25px);
    fill: $primary-dark;
  }

  .title-badge {
    background-color: $primary-dark;
    color: white;
  }

  .badge {
    margin-right: $space-xs;
  }
}

@media screen and (max-width: $max-mobile) {
  .info-sentence {
    flex-direction: column;
    align-items: flex-start;

    .text {
      width: fit-content;
    }

    .second-part {
      padding-left: 30px;
      width: 100%;
    }
  }
}
</style>
