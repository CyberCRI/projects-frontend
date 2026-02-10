<template>
  <div id="projects-map">
    <Transition name="fade">
      <div v-if="isLoading" class="map-loader">
        <LoaderComplex :label="$t('location.loading')" />
      </div>
    </Transition>
    <GeneralMap :locations="data" :loading="isLoading" />
    <div v-if="!isLoading && isEmpty" class="empty-map">
      {{ $t('map.empty') }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { getLocations } from '@/api/v2/location.service'
import GeneralMap from '@/components/map/GeneralMap.vue'
import { useLpiHead2 } from '@/composables/useLpiHead'

const organizationCode = useOrganizationCode()
const { t } = useNuxtI18n()

const { isLoading, data } = getLocations(organizationCode)

watch(data, () => console.log(data))

const isEmpty = computed(() => data.value.groups.length + data.value.projects.length === 0)

onBeforeUnmount(() => {
  document.body.classList.remove('map-no-scroll')
})

onMounted(async () => {
  document.body.classList.add('map-no-scroll')
})

useLpiHead2({
  title: computed(() => t('map.page-title')),
  description: computed(() => t('map.page-title')),
})
</script>

<style lang="scss" scoped>
#projects-map {
  height: calc(100vh - $navbar-height);
  margin-top: $navbar-height;
  position: relative;
  touch-action: none;

  .leaflet-map,
  .leaflet-container {
    height: 100%;
  }

  .map-loader {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    z-index: $zindex-fixed;

    svg {
      margin: 0 auto $space-m;
    }
  }

  .leaflet-top {
    // override leaflet value
    margin-top: pxToRem(40px);
  }

  .empty-map {
    display: inline-block;
    background-color: $primary-light;
    border-radius: $border-radius-l;
    padding: $space-l;
    font-size: $font-size-xl;
    text-align: center;
    position: absolute;
    top: 50%;
    left: 50%;
    z-index: 100000; // yes map is high....
    transform: translate(-50%, -50%);
    max-width: 90vw;
  }

  .icon {
    width: pxToRem(18px);
    height: pxToRem(18px);

    &--close {
      background: $primary-dark;
      fill: $white;
      border-radius: 50%;
    }
  }
}
</style>
