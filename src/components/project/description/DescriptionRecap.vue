<template>
  <div class="description-recap">
    <h4 class="description-label">
      {{ $t('form.description') }}
    </h4>

    <div :style="style" class="description-content-ctn">
      <HtmlLimiter
        :html="description"
        :striped-tags="[]"
        class="description-content"
        preprocess
        @computed="layoutComputed"
        @computing="computeLayout"
      />
    </div>

    <SeeMoreArrow
      class="read-description-button"
      :to="{
        name: 'projectDescription',
        hash: '#tab',
        params: { slugOrId: $route.params.slugOrId },
      }"
    />
  </div>
</template>

<script>
import SeeMoreArrow from '@/components/base/button/SeeMoreArrow.vue'
import HtmlLimiter from '@/components/base/HtmlLimiter.vue'

export default {
  name: 'DescriptionRecap',

  components: { SeeMoreArrow, HtmlLimiter },

  props: {
    description: {
      type: String,
      required: true,
    },
  },

  data() {
    return {
      style: {},
    }
  },

  methods: {
    computeLayout() {
      this.style = {}
    },
    layoutComputed(event) {
      this.style = { height: event.height + 'px' }
    },
  },
}
</script>

<style lang="scss">
.description-recap {
  background: $white;
  border-radius: $border-radius-l;
  padding: $space-2xl;
  color: $black;
  border: $border-width-s solid $primary;

  .description-label {
    font-size: $font-size-l;
    font-weight: 700;
    color: $primary-dark;
    line-height: $line-height-tight;
  }

  .description-content-ctn {
    margin: $space-l 0;
    position: relative;
    height: 370px; // max-height: 370px;
    display: flex;
    flex-flow: column;

    .description-content {
      h1 {
        font-size: $font-size-2xl;
        font-weight: 700;
      }

      h2 {
        font-size: $font-size-xl;
        font-weight: 500;
      }

      h3 {
        font-size: $font-size-l;
        font-weight: 500;
      }

      h4 {
        font-size: $font-size-m;
        font-weight: 500;
      }
    }

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
  }

  .read-description-button {
    font-size: $font-size-m;
    padding: 0;
  }
}
</style>
