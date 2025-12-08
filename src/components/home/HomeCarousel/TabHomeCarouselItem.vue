<template>
  <div class="tab-home-carousel-item">
    <picture v-for="source in tab.image.sources" :key="source.type">
      <source :sizes="source.sizes" :srcset="source.srcset" :type="source.type" />
      <img :alt="tab.title" :src="tab.image.default" />
    </picture>

    <div class="tab-text-container">
      <h3 class="title">
        {{ tab.title }}
      </h3>

      <i18n-t :keypath="tab.text" tag="p">
        <a place="sdg" :href="t('homeCarousel.tab4.link')">
          <abbr :title="t('homeCarousel.tab4.sdgAbbr')">{{ t('homeCarousel.tab4.sdg') }}</abbr>
        </a>
      </i18n-t>
    </div>
  </div>
</template>

<script setup>
defineOptions({ name: 'TabHomeCarouselItem' })
defineProps({
  tab: {
    type: Object,
    default: () => {},
  },
})
const { t } = useNuxtI18n()
</script>

<style lang="scss" scoped>
.tab-home-carousel-item {
  display: flex;
  flex-direction: column-reverse;
  align-items: stretch;
  background-color: $white;

  img {
    width: 100%;
    max-width: 100%;
  }

  @media (min-width: $min-tablet) {
    flex-direction: row;
    align-items: stretch;

    img {
      max-width: unset;
      border-top-right-radius: 21px;
      border-top-left-radius: 21px;
      box-shadow: 7px 9px 15px $light-gray;
    }

    picture {
      display: flex;
      align-items: stretch;
      padding: $space-l $space-l 0 $space-l;
    }
  }

  .tab-text-container {
    padding: $space-l;

    .title {
      font-size: $font-size-2xl;
      margin-bottom: $space-l;
    }
  }

  a {
    color: $primary-dark;
    text-decoration: underline;
  }
}
</style>
