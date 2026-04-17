<template>
  <div class="sdg-recap">
    <div>
      <CroppedImage :src="sdgLogoInfo" class="sdg-logo" />
      <TransitionGroup tag="div" name="sdg" class="current-list">
        <SdgIcon v-for="sdg in sdgs" :key="sdg" :sdg-id="sdg" />
      </TransitionGroup>
    </div>

    <LpiButton
      v-if="isInEditingMode && canEditProject"
      :label="$t('sdg.add-short')"
      class="add-sdg-btn"
      btn-icon="Plus"
      @click="showSdgModal"
    />
  </div>
</template>

<script setup lang="ts">
import LpiButton from '@/components/base/button/LpiButton.vue'
import SdgIcon from '@/components/search/Filters/SdgIcon.vue'
import { usePublicURL } from '@/composables/usePublic'

const projectLayoutToggleAddModal = inject<(string) => void>('projectLayoutToggleAddModal')

withDefaults(
  defineProps<{
    sdgs?: (string | number)[]
    isInEditingMode?: boolean
  }>(),
  {
    sdgs: () => [],
    isInEditingMode: false,
  }
)

const { canEditProject } = usePermissions()

const sdgLogoInfo = usePublicURL('/sdgs/logo.png')

const showSdgModal = () => {
  projectLayoutToggleAddModal('sdg')
}
</script>

<style lang="scss" scoped>
.sdg-enter-active,
.sdg-leave-active {
  transition: all 0.4s ease;
  transform: translateZ(0);
}

.sdg-enter-from,
.sdg-leave-to {
  transform: translateZ(0) scale(0) translateY(200%);
}

.sdg-recap {
  display: flex;
  align-items: center;
  justify-content: space-between;
  border: $border-width-s solid $black;
  border-radius: $border-radius-l;
  overflow: hidden;
  padding: $space-2xs;
  background: $white;

  > div:first-of-type {
    display: flex;
    align-items: center;
  }

  .sdg-logo {
    height: 100px;
    width: 80px;
    background-repeat: no-repeat;
    background-size: contain;
    padding: 0 $space-xs;
  }

  .current-list {
    display: flex;
    flex-wrap: wrap;
    gap: $space-2xs;
    width: fit-content;

    > div {
      height: 100px;
      width: 100px;
      background-repeat: no-repeat;
      background-size: contain;
    }
  }

  .add-sdg-btn {
    margin-left: $space-2xs;
  }
}

@media screen and (max-width: $max-mobile) {
  .sdg-recap {
    flex-direction: column;

    > div:first-of-type {
      flex-direction: column;

      .current-list {
        justify-content: center;
      }
    }

    .add-sdg-btn {
      margin-left: 0;
      margin-top: $space-2xs;
    }
  }
}
</style>
