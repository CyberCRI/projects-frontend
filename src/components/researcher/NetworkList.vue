<template>
  <div class="network-list">
    <h3 class="list-title">{{ listTitle }}</h3>
    <div class="list-notice clamped-ctn">
      <div class="clamped">{{ listNotice }}</div>
    </div>
    <div class="list-items">
      <div v-for="(item, index) in listItems" :key="index" class="list-item">
        <IconImage class="item-icon" name="ArrowRight" />
        <div class="item-content">
          <h5 class="item-link clamped-ctn">
            <div class="clamped">
              <a href="item.link">{{ item.label }}</a>
            </div>
          </h5>
          <p v-if="item.notice" class="item-notice">{{ item.notice }}</p>
        </div>
      </div>
    </div>
    <BaseModuleButton
      btn-icon="ArrowRight"
      :label="$t('common.see-top-n', { n: listMoreCount })"
      :to="listMoreLink"
    />
  </div>
</template>
<script lang="ts" setup>
defineProps<{
  listItems: Array<{ label: string; notice?: string; link: string }>
  listMoreLink: string
  listMoreCount: number
  listTitle: string
  listNotice: string
}>()
</script>
<style lang="scss" scoped>
@use '~/design/scss/variables';

.network-list {
  .list-title {
    font-weight: 600;
    font-size: 1rem;
    margin: 0;
  }

  .list-notice {
    font-size: 0.8rem;
  }

  .list-items {
    display: flex;
    flex-flow: column nowrap;
    gap: 1rem;
    margin-block: 1rem;
  }

  .list-item {
    display: flex;
    gap: 0.6rem;
    align-items: flex-start;

    .item-icon {
      width: 1.5rem;
      height: 1.5rem;
      flex-grow: 0;
      flex-shrink: 0;
      fill: variables.$primary;
    }

    .item-content {
      flex-grow: 1;
    }

    .item-link {
      color: variables.$primary-dark;
      font-weight: 600;
      margin-bottom: 0.6rem;
    }

    .item-notice {
      font-size: 0.8rem;
    }
  }

  .clamped-ctn {
    position: relative;
    height: 1.2em;
  }

  .clamped {
    text-overflow: ellipsis;
    overflow: hidden;
    white-space: nowrap;

    // trick needed to limit the label size
    position: absolute;
    inset: 0;
  }
}
</style>
