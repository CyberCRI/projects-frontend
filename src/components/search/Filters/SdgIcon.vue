<template>
  <div
    :class="{ 'sdg--unselected': !selected, [props.logo]: true }"
    class="sdg"
    :data-test="`sdg-${sdgId}`"
    @click="toggle"
  >
    <CroppedImage
      :alt="alt"
      :src="imageUrl"
      :loading-color="sdgInfo?.background_color"
      class="img"
    />
    <IconImage v-if="selected" class="check-icon" name="Check" />
  </div>
</template>

<script setup lang="ts">
import IconImage from '@/components/base/media/IconImage.vue'
import { SDGS } from '@/functs/constants'
import { usePublicURL } from '@/composables/usePublic'

const props = withDefaults(
  defineProps<{
    sdgId: number | string
    logo?: 'full' | 'short'
    selected?: boolean
  }>(),
  { selected: false, logo: 'full' }
)

const { t } = useNuxtI18n()

const emit = defineEmits<{
  toggled: [typeof props.sdgId]
}>()
const { locale } = useNuxtI18n()

const imageUrl = computed(() => {
  if (props.logo === 'full') {
    return usePublicURL(`/sdgs/${locale.value}/${props.sdgId}.svg`)
  } else {
    return usePublicURL(`/sdgs/logo/SDG-${props.sdgId}.svg`)
  }
})

// find backgroundColor from sdg (during loading image , the background is color from sdg)
const sdgInfo = computed(() => SDGS.find((el) => el.id.toString() === props.sdgId.toString()))

const alt = computed(() => {
  return t(`sdg.${props.sdgId}.title`) || sdgInfo.value?.title
})

const toggle = () => emit('toggled', props.sdgId)
</script>

<style lang="scss" scoped>
/* We use box-shadow to mimic borders
** so when a filter is selected
** the other do not move due the pixel diff
*/

.sdg {
  display: inline-block;
  width: pxToRem(96px);
  height: pxToRem(96px);
  border-radius: $border-radius-xs;
  background-repeat: no-repeat;
  background-position: center center;
  background-size: cover;
  cursor: pointer;
  box-shadow: 0 0 0 $border-width-l $primary-dark;
  position: relative;

  &.short {
    border-radius: $border-radius-l;
  }

  .img {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
  }

  &--unselected {
    box-shadow: none;
  }

  .check-icon {
    position: absolute;
    width: pxToRem(20px);
    height: pxToRem(20px);
    top: -14px;
    right: 8px;
    fill: $primary-dark;
    background: white;
    border: $border-width-s solid $primary-dark;
    border-radius: $border-radius-50;
  }
}
</style>
