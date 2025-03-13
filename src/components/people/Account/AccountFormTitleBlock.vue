<template>
  <div class="title-block">
    <h1 class="main-title">
      {{ mainTitleLabel }}
    </h1>

    <p v-if="showHelp" class="sub-main-title">
      {{ $t('account.sub-title')
      }}<NuxtLink :to="{ name: 'Help' }" class="link">
        {{ $t('account.link') }}
      </NuxtLink>
    </p>
  </div>
</template>

<script>
export default {
  name: 'AccountFormTitleBlock',

  props: {
    mainTitleLabel: {
      type: String,
      required: true,
    },
    showHelp: {
      type: Boolean,
      required: true,
    },
  },
}
</script>

<style scoped lang="scss">
.title-block {
  padding-bottom: $space-m;

  .main-title {
    font-weight: 700;
    font-size: $font-size-5xl;
    text-align: center;
    line-height: $line-height-tight;
  }

  .sub-main-title {
    font-weight: 400;
    font-size: $font-size-m;
    margin-top: $space-xl;

    .link {
      font-weight: 700;
      color: $primary-dark;
      text-decoration: underline;
    }
  }
}
</style>
