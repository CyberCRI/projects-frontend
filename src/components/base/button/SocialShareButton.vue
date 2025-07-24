<template>
  <ToolTip class="share-tip shadowed" placement="bottom" trigger="clickToOpen">
    <template #custom-content>
      <div class="share-ctn">
        <LinkButton btn-icon="Facebook" @click="facebookShare" />
        <LinkButton btn-icon="Linkedin" @click="linkedinShare" />
      </div>
    </template>
    <ExternalLabelButton
      class="space-button bg-on-hover"
      :label="$t('group.share')"
      btn-icon="Share"
      vertical-layout
    />
  </ToolTip>
</template>
<script>
export default {
  name: 'SocialShareButton',

  props: {
    sharedUrl: {
      type: String,
      default: '',
    },
  },

  computed: {
    url() {
      return this.sharedUrl || window?.location?.origin
    },
  },

  methods: {
    facebookShare() {
      window?.open(`https://www.facebook.com/sharer/sharer.php?u=${this.url}`)
    },
    // twitterShare() {
    //     window?.open(`https://twitter.com/intent/tweet?url=${this.url}&text=`)
    // },
    linkedinShare() {
      window?.open(`https://www.linkedin.com/shareArticle?mini=true&url=${this.url}`)
    },
  },
}
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
