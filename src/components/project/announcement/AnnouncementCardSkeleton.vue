<template>
  <div class="announcement-wrapper">
    <div class="announcement-card shadow-box">
      <div class="announcement-header horizontal-padding top-padding">
        <span class="date-ctn">
          <SkeletonComponent class="description" tag="p" height="16px" width="8rem" />
        </span>
      </div>

      <div class="main-content horizontal-padding bottom-padding">
        <h3 class="announcement-title bottom-padding">
          <SkeletonComponent height="16px" width="100%" />
        </h3>

        <SkeletonComponent class="margin-bottom" tag="p" height="16px" width="100%" />
        <SkeletonComponent class="margin-bottom" tag="p" height="16px" width="100%" />
      </div>
      <div class="announcement-link horizontal-padding bottom-padding">
        <span class="read">
          <SkeletonComponent tag="h4" height="16px" width="8rem" />
        </span>
      </div>
      <div class="announcement-project horizontal-padding top-padding bottom-padding">
        <SkeletonComponent height="72px" width="72px" />
        <div class="text">
          <SkeletonComponent class="margin-bottom" tag="h5" height="16px" width="100%" />
          <SkeletonComponent class="margin-bottom" tag="h4" height="16px" width="100%" />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import SkeletonComponent from '@/components/base/loader/SkeletonComponent.vue'

export default {
  name: 'AnnouncementCardSkeleton',

  components: { SkeletonComponent },
}
</script>

<style lang="scss" scoped>
$annoucement-picto-size: 72px;
$annoucement-padding: pxToRem(20px);

.margin-bottom {
  margin-bottom: $space-m;
}

.announcement-wrapper {
  width: min-content;

  .announcement-card {
    position: relative;
    border: $border-width-s solid $primary;
    border-radius: $border-radius-m;
    width: 356px;
    height: 462px;
    background: $white;
    color: $black;
    display: flex;
    flex-flow: column nowrap;

    .horizontal-padding {
      padding-left: $annoucement-padding;
      padding-right: $annoucement-padding;
    }

    .top-padding {
      padding-top: $annoucement-padding;
    }

    .bottom-padding {
      padding-bottom: $annoucement-padding;
    }

    .announcement-header {
      color: $primary-dark;
      font-size: $font-size-s;
      font-weight: 700;
      text-transform: uppercase;
      flex-shrink: 0;
      flex-grow: 0;

      .dot {
        position: relative;
        top: -2px;
        padding: 0 $space-s;
      }
    }

    .main-content {
      display: flex;
      flex-flow: column nowrap;
      justify-content: flex-start;
      padding-top: $space-l;

      .announcement-title,
      .description {
        overflow: hidden;
        text-overflow: ellipsis;
        word-break: break-word;
        display: -webkit-box;
        -webkit-box-orient: vertical;
      }

      .announcement-title {
        font-size: $font-size-l;
        font-weight: 500;
        -webkit-line-clamp: 3;
      }

      .description {
        font-size: $font-size-m;
        -webkit-line-clamp: 6;
      }
    }

    .announcement-link {
      flex-shrink: 0;
      flex-grow: 1;
    }

    .read {
      border: 0 none;
      outline: none;
      background-color: transparent;
      color: $primary-dark;
      font-weight: 700;
      font-size: $font-size-m;
      text-transform: capitalize;
      padding: 0;
      display: flex;
      align-items: flex-start;

      .icon {
        width: $layout-size-l;
        padding-right: $space-xs;
        display: inline-block;

        svg {
          fill: $primary-dark;
        }
      }
    }

    .announcement-project {
      flex: 0 0 0;
      display: flex;
      background-color: $primary-lighter;
      border-bottom-left-radius: $border-radius-m;
      border-bottom-right-radius: $border-radius-m;

      .project-label {
        text-transform: uppercase;
        color: $primary-dark;
        font-size: $font-size-2xs;
        font-weight: bold;
        margin: 0;
        padding-bottom: $space-s;
      }

      .picto {
        width: pxToRem($annoucement-picto-size);
        flex-basis: pxToRem($annoucement-picto-size);
        flex-shrink: 0;
        height: pxToRem($annoucement-picto-size);
        background-position: center center;
        background-size: cover;
        border-radius: $border-radius-xs;
      }

      .text {
        padding-left: $annoucement-padding;
        display: flex;
        flex-flow: column nowrap;
        justify-content: flex-start;
        flex-grow: 1;

        .project-label,
        .spacer {
          flex-shrink: 0;
          flex-grow: 0;
        }
      }

      .project-title {
        -webkit-line-clamp: 2;
        overflow: hidden;
        text-overflow: ellipsis;
        word-break: break-word;
        display: -webkit-box;
        -webkit-box-orient: vertical;
      }
    }
  }
}
</style>
