<template>
  <ToolTip class="share-tip shadowed" placement="bottom" trigger="clickToOpen">
    <template #custom-content>
      <div class="share-ctn">
        <LinkButton btn-icon="Facebook" @click="facebookShare" />
        <LinkButton btn-icon="Linkedin" @click="linkedinShare" />
      </div>
    </template>
    <ExternalLabelButton
      class="space-button"
      :label="$t('group.share')"
      btn-icon="Share"
      vertical-layout
      label-on-hover
    />
  </ToolTip>
</template>
<script setup lang="ts">
const props = withDefaults(
  defineProps<{
    sharedUrl?: string
  }>(),
  {
    sharedUrl: '',
  }
)

const url = computed(() => props.sharedUrl || window?.location?.origin)

const facebookShare = () =>
  window?.open(`https://www.facebook.com/sharer/sharer.php?u=${url.value}`)
const linkedinShare = () =>
  window?.open(`https://www.linkedin.com/shareArticle?mini=true&url=${url.value}`)
</script>
<style scoped lang="scss">
.share-ctn {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: $space-m;
  z-index: 1;
  flex-grow: 1;
  flex-shrink: 1;

  --btn-icon-size: 28px;
}
</style>
