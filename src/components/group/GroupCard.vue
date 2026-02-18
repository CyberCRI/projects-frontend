<template>
  <BasicCard
    :group="group"
    :to-link="toLink"
    :data-test="`group-card-${group.name}`"
    :mode="mode"
    :line-clamp="lineClamp"
    @click="toGroupPage"
  >
    <template #actions-right>
      <IconImage v-if="group.email" class="icon" name="EmailOutline" @click="mailTo" />
      <IconImage v-if="showAddButton" class="icon" name="Plus" @click="$emit('add')" />
      <IconImage
        v-if="showCloseButton"
        class="icon"
        name="CloseCircle"
        @click="$emit('unselect', group)"
      />
    </template>

    <CroppedApiImage
      :alt="`${group.name} image`"
      class="picture picture-group skeletons-image"
      :picture-data="group.header_image"
      picture-size="medium"
      :default-picture="DEFAULT_USER_PATATOID"
    />

    <div class="text text-limit">
      <div v-if="modules.members" class="group-count skeletons-background">
        <IconImage name="MultiplePerson" class="icon" />
        {{ modules.members }}
      </div>
      <div class="card-type skeletons-text">
        {{ translatedName }}
      </div>
      <p class="skeletons-text" v-html="translatedShortDescription" />
    </div>

    <template v-if="modules.subgroups" #footer>
      <NuxtLink
        :to="{
          name: 'Groups',
          params: { groupId: group.id },
        }"
        class="subgroups-link"
      >
        {{ $t('group.see-subgroups', modules.subgroups) }}
        <IconImage class="arrow" name="ArrowRight" />
      </NuxtLink>
    </template>
  </BasicCard>
</template>

<script setup lang="ts">
import BasicCard from '@/components/base/BasicCard.vue'
import IconImage from '@/components/base/media/IconImage.vue'
import CroppedApiImage from '@/components/base/media/CroppedApiImage.vue'
import { DEFAULT_USER_PATATOID } from '@/composables/usePatatoids'
import { TranslatedPeopleGroupModel } from '@/models/invitation.model'

const props = withDefaults(
  defineProps<{
    group: TranslatedPeopleGroupModel
    hasAddIcon?: boolean
    hasCloseIcon?: boolean
    mode?: 'card' | 'list'
  }>(),
  {
    hasAddIcon: false,
    hasCloseIcon: false,
    mode: 'card',
  }
)

const emit = defineEmits<{
  add: []
  unselect: [TranslatedPeopleGroupModel]
  click: [TranslatedPeopleGroupModel]
  'navigated-away': []
}>()

const translatedName = computed(() => props.group.$t?.name ?? props.group.name)
const translatedShortDescription = computed(
  () => props.group.$t?.short_description ?? props.group.short_description
)

const showAddButton = computed(() => props.hasAddIcon)
const showCloseButton = computed(() => props.hasCloseIcon)
const toLink = computed(() => {
  // a to-link attribute make the basic card a NuxtLink
  // witch we dont want when just selecting project
  return showAddButton.value ? null : { name: 'Group', params: { groupId: props.group.id } }
})

const modules = computed(() => props.group.modules ?? ({} as TranslatedPeopleGroupModel['modules']))

// calculate lineClamp description
const lineClamp = computed(() => {
  let defaultLineClamp = 6
  if (modules.value.subgroups) {
    defaultLineClamp -= 2
  }
  if (modules.value.members) {
    defaultLineClamp -= 1
  }

  return defaultLineClamp
})

const mailTo = () => (document.location.href = `mailto:${props.group.email}`)
const toGroupPage = () => {
  // this is a quick and dirty fix to make whole card clickable for selection
  if (showAddButton.value) {
    emit('add')
  } else {
    emit('navigated-away')
  }
}
</script>

<style lang="scss" scoped>
.group-count {
  display: flex;
  font-weight: 700;
  font-size: $font-size-xs;
  color: $primary-dark;
  align-items: center;

  .icon {
    fill: $primary-dark;
    margin-right: $space-s;
    width: 16px;
  }
}

.card .group-count {
  margin-top: $space-s;
  justify-content: center;
}

.card-type {
  font-weight: 700;
  font-size: $font-size-m;
  color: $almost-black;
}

.subgroups-link {
  background-color: $primary-dark;
  color: $white;
  font-weight: bold;
  text-align: center;
  justify-self: end;
  padding: $space-xs $space-s;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: $layout-size-xs;
  cursor: pointer;
  font-size: $font-size-xs;

  .arrow {
    fill: $white;
    height: $layout-size-s;
    width: $layout-size-s;
  }
}
</style>
