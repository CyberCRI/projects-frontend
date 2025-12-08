<template>
  <div class="whole-content">
    <div :class="{ loading, moreInfo }" class="project-header-ctn">
      <div class="img-position">
        <div class="img-mobile-ctn">
          <SkeletonComponent v-if="loading" height="100%" width="100%" />

          <CroppedApiImage
            v-if="!loading && project?.header_image?.variations"
            ref="projectImg"
            :picture-data="project.header_image"
            picture-size="medium"
            default-picture="/placeholders/header_placeholder.png"
          />
        </div>
      </div>
      <div class="content-ctn">
        <div :class="{ 'has-sdg': sdgs?.length }" class="main-info-ctn">
          <div class="img-block">
            <div class="img-ctn">
              <SkeletonComponent v-if="loading" height="100%" width="100%" />

              <CroppedApiImage
                v-if="!loading && project?.header_image?.variations"
                ref="projectImg"
                :picture-data="project.header_image"
                picture-size="medium"
                default-picture="/placeholders/header_placeholder.png"
                :alt="`${project.title} image`"
              />
            </div>
          </div>
          <div class="text-content">
            <SkeletonComponent v-if="loading" class="skeleton-block" height="42px" tag="h1" />
            <div v-else class="title-block">
              <h1 v-if="project && project.title" id="project-title" class="title">
                {{ capitalizedTitle }}
              </h1>
              <IconImage
                v-if="showFullTitleIcon"
                class="icon title-chevron"
                name="ChevronDown"
                @click="showFullTitle = !showFullTitle"
              />
              <div v-if="project && project.title && showFullTitle" class="full-title-block">
                <h1 v-if="project && project.title" class="full-title">
                  {{ capitalizedTitle }}
                </h1>

                <IconImage
                  class="icon icon-open title-chevron"
                  name="ChevronUp"
                  @click="showFullTitle = !showFullTitle"
                />
              </div>
            </div>

            <div class="tag-list-desktop">
              <div v-if="loading" class="tag-ctn-skeleton">
                <SkeletonComponent height="19px" width="50px" />
                <SkeletonComponent height="19px" width="50px" />
                <SkeletonComponent height="19px" width="50px" />
              </div>

              <TagsList
                v-else-if="project?.tags?.length"
                :tags="project.tags"
                class="tag-list"
                prefix="desktop"
              />
            </div>
            <SkeletonComponent v-if="loading" class="skeleton-block" height="24px" />
            <div v-else-if="showPurposeWithEmptyContent" class="purpose-block">
              <h4 v-if="project && project.purpose" id="project-purpose" class="purpose">
                {{ capitalizedPurpose }}
              </h4>
              <IconImage
                v-if="showFullPurposeIcon"
                class="icon purpose-chevron"
                name="ChevronDown"
                @click="showFullPurpose = !showFullPurpose"
              />
              <div v-if="project && project.purpose && showFullPurpose" class="full-title-block">
                <h4 v-if="project && project.purpose" class="full-purpose">
                  {{ capitalizedPurpose }}
                </h4>

                <IconImage
                  class="icon icon--open purpose-chevron"
                  name="ChevronUp"
                  @click="showFullPurpose = !showFullPurpose"
                />
              </div>
            </div>
            <div v-if="mobileScreen" class="tag-list-mobile">
              <div v-if="loading" class="tag-ctn-skeleton">
                <SkeletonComponent height="44px" width="100%" />
              </div>

              <TagsList
                v-else-if="project?.tags?.length"
                :tags="project.tags"
                class="tag-list"
                prefix="mobile"
              />
            </div>

            <div class="visibility-desktop">
              <div v-if="project && project.publication_status" class="visibility">
                <InfoSentence
                  :data="visibility"
                  :no-centered="true"
                  :all-plain="true"
                  :black="true"
                  size="medium"
                  button-size="mbutton"
                  :inline="true"
                />
              </div>
            </div>

            <div v-if="loading" class="sdg-ctn">
              <SkeletonComponent border-radius="50%" height="30px" width="30px" />
            </div>

            <div v-show="!loading && sdgs?.length" class="sdg-ctn">
              <TransitionGroup name="sdg" tag="div">
                <NuxtLink
                  v-for="sdg in sdgs || []"
                  :key="sdg"
                  :to="browseProjectsWithQuery('sdgs', sdg)"
                  class="sdg-link"
                >
                  <img
                    :alt="sdg"
                    :src="`${runtimeConfig.public.appPublicBinariesPrefix}/sdgs/logo/SDG-${sdg}.svg`"
                    class="sdg"
                  />
                </NuxtLink>
              </TransitionGroup>
            </div>

            <div class="visibility-mobile">
              <div v-if="project && project.publication_status" class="visibility">
                <InfoSentence
                  :data="visibility"
                  :no-centered="true"
                  :all-bold="true"
                  size="medium"
                  button-size="mbutton"
                  :inline="true"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { capitalize } from '@/functs/string'
import useOrganizationsStore from '@/stores/useOrganizations.ts'
import useUsersStore from '@/stores/useUsers.ts'

export default {
  name: 'ProjectHeaderV2',

  inject: ['projectLayoutGoToTab'],
  props: {
    project: {
      type: Object,
      default: () => ({}),
    },

    sdgs: {
      type: Array,
      default: () => [],
    },

    loading: {
      type: Boolean,
      default: true,
    },
  },

  emits: ['show-project-announcements', 'update-follow'],
  setup() {
    const organizationsStore = useOrganizationsStore()
    const usersStore = useUsersStore()
    const runtimeConfig = useRuntimeConfig()
    return {
      organizationsStore,
      usersStore,
      runtimeConfig,
    }
  },

  data() {
    return {
      imageAlertDismissed: false,
      showFullTitle: false,
      showFullPurpose: false,
      showFullTitleIcon: false,
      showFullPurposeIcon: false,
      moreInfo: false,
      plusButton: 0,
    }
  },

  computed: {
    showPurposeWithEmptyContent() {
      return this.project && this.project.purpose !== '   ' && this.project.purpose.length !== 0
    },

    visibility() {
      let ret = ''
      if (this.project.publication_status) {
        let visibilityIcon = this.visibilityIcon()
        let visibilityTitle = 'header.' + this.project.publication_status
        ret = { icon: visibilityIcon, title: visibilityTitle }
      }
      return ret
    },
    screenWidth() {
      return window?.innerWidth
    },
    mobileScreen() {
      return this.screenWidth <= 768
    },

    capitalizedTitle() {
      const title = this.project?.$t?.title
      return capitalize(title)
    },

    capitalizedPurpose() {
      const purpose = this.project?.$t?.purpose
      return capitalize(purpose)
    },
  },
  watch: {
    loading() {
      this.setToggleIcon()
    },
  },

  mounted() {
    window.addEventListener('resize', this.setToggleIcon)
    window.addEventListener('click', this.onClick)
  },

  unmounted() {
    window.removeEventListener('resize', this.setToggleIcon)
    window.removeEventListener('click', this.onClick)
  },

  methods: {
    // TODO: wtf ?
    onClick(e) {
      if (this.plusButton > 0) {
        this.plusButton += 1
      }
      let moreInfo = document.querySelector('.more-info-block')
      if (
        this.moreInfo &&
        this.plusButton > 2 &&
        moreInfo &&
        (!moreInfo.contains(e.target) ||
          (!e.target.closest('.tag-elt-show-more') &&
            (e.target.closest('.tag-elt') || e.target.closest('.extra-tag-elt'))))
      ) {
        this.moreInfo = false
        this.plusButton = 0
      }
    },

    setToggleIcon() {
      this.$nextTick(() => {
        const title = document.getElementById('project-title')
        const purpose = document.getElementById('project-purpose')

        this.showFullTitleIcon = title
          ? title.scrollHeight > title.clientHeight || title.scrollHeight > title.clientHeight
          : false

        this.showFullPurposeIcon = purpose
          ? purpose.scrollHeight > purpose.clientHeight ||
            purpose.scrollHeight > purpose.clientHeight
          : false
      })
    },

    browseProjectsWithQuery(queryField, queryValue) {
      return {
        name: 'ProjectSearch',
        query: {
          [queryField]: queryValue,
          section: 'projects',
        },
      }
    },

    visibilityIcon() {
      const map = {
        public: 'Eye',
        private: 'EyeSlash',
        org: 'PeopleGroup',
      }
      return map[this.project.publication_status] || ''
    },
  },
}
</script>

<style lang="scss" scoped>
:deep(.share-tip > div) {
  display: flex;
  justify-content: center;
}

:deep(.share-tip .trigger) {
  text-align: right;
}

.whole-content {
  display: block !important;
}

.project-header-ctn {
  position: relative;

  .title-block,
  .purpose-block {
    display: flex;
    flex-direction: row;
    align-items: flex-end;
    position: relative;
  }

  .title-block {
    margin-top: pxToRem(16px);
  }

  .purpose-block {
    margin-bottom: pxToRem(16px);
  }

  @media screen and (min-width: $min-tablet) {
    .title-block {
      margin-top: 10px;
    }
  }

  @media screen and (max-width: $min-tablet) {
    .title-block,
    .purpose-block {
      margin-top: 0;
    }

    .purpose-block {
      margin-bottom: $space-l;
    }

    .close-button {
      display: none;
    }
  }

  .full-title-block {
    position: absolute;
    top: 0;
    left: 0;
    background-color: $white;
    box-shadow: 0 0 6px rgb(0 0 0 / 15%);
    border-radius: 16px;
    padding: $space-m;
    min-height: 90%;
    display: flex;
    align-items: center;
    min-width: 100%;
    z-index: 1;

    .full-title {
      font-weight: 700;
      font-size: $font-size-xl;
      line-height: $line-height-tight;
    }
  }

  .full-purpose {
    font-weight: 400;
    font-size: $font-size-m;
  }

  .visibility {
    font-weight: 700;
    font-size: 14px;
    line-height: $line-height-compact;
    color: $primary-dark;
  }

  .visibility-desktop {
    margin-bottom: 20px;
  }

  @media screen and (max-width: $min-tablet) {
    .visibility {
      color: $primary-dark;
    }
  }

  .img-block {
    flex-shrink: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: pxToRem(40px);

    @media screen and (max-width: $min-tablet) {
      padding: 0;
    }
  }

  .img-mobile-ctn {
    width: 260px;
    height: 260px; // yes width of viewport so we get a square
    margin-top: 30px;
    margin-bottom: 30px;
    background-color: $white;
    display: flex;
    justify-content: center;
    align-items: center;

    .cropped-image {
      width: 100%;
      height: 100%;
      border-radius: $border-radius-l;
    }

    .organizations-grid {
      position: absolute;
      bottom: pxToRem(64px);
      left: pxToRem(15px);
    }
  }

  .img-ctn {
    border-radius: $border-radius-l;
    overflow: hidden;
    height: 260px;
    width: 260px;
    background-color: $white;
    display: flex;
    justify-content: center;
    align-items: center;

    .cropped-image {
      width: 100%;
      height: 100%;
    }

    .organizations-grid {
      position: absolute;
      bottom: pxToRem(64px);
      left: pxToRem(15px);
    }
  }

  @media screen and (min-width: $min-tablet) {
    .content-ctn .main-info-ctn {
      display: flex;
    }
  }

  @media screen and (min-width: $min-tablet) and (max-width: $max-tablet) {
    .content-ctn .main-info-ctn {
      display: flex;
      flex-flow: column;
      padding: 1.2rem;
    }
  }

  @media screen and (min-width: $min-tablet) {
    &:not(.loading) {
      .content-ctn .main-info-ctn {
        height: 100%;
      }
    }

    .img-ctn {
      display: flex;
    }

    .img-position,
    .tag-list-mobile,
    .more-info-block-mobile,
    .visibility-mobile {
      display: none;
    }

    .tag-list-desktop,
    .more-info-block-desktop,
    .visibility-desktop {
      display: block;
    }

    .close-button {
      display: inline-flex;
    }
  }

  @media screen and (max-width: $min-tablet) {
    .visibility-mobile {
      display: block;
    }
  }

  .content-ctn {
    position: relative;
    height: 100%;
    width: 100%;

    .main-info-ctn {
      position: relative;
      background: $white;

      .text-content {
        display: flex;
        flex-direction: column;
        justify-content: center;
        flex-grow: 1;
        padding-right: pxToRem(40px);

        @media screen and (max-width: $min-tablet) {
          padding: 0 pxToRem(40px);
        }
      }

      @media screen and (min-width: $min-tablet) {
        &.has-sdg {
          padding-bottom: 0;
        }
      }

      @media screen and (min-width: $min-tablet) {
        border: $border-width-s solid $primary;
        border-radius: $border-radius-l;
      }

      @media screen and (max-width: $min-tablet) {
        border: none;
      }

      @media screen and (max-width: $min-tablet) {
        padding-top: 0;
      }

      .overflowing-badges {
        position: absolute;
        top: pxToRem(-18px);
        left: 50%;
        transform: translateX(-50%);
        display: flex;
        align-items: center;

        .quantity-text-badge {
          border: $border-width-s solid $primary;
          border-radius: $border-radius-l;
          background: $white;
          margin-left: pxToRem(20px);
          display: flex;
          align-items: center;
          overflow: hidden;
          color: $primary-dark;
          font-weight: bold;
          font-size: $font-size-xs;
          text-transform: uppercase;
          height: 37px;
          box-sizing: border-box;

          &.cursor-pointer {
            cursor: pointer;
          }

          .quantity {
            background: $primary;
            color: $white;
            height: 100%;
            border-right: $border-width-s solid $primary;
            padding: $space-xs $space-unit;
            display: flex;
            align-items: center;
            justify-content: center;
          }

          span {
            padding: $space-xs $space-s;
            white-space: nowrap;
          }
        }

        .announcement-badge {
          cursor: pointer;
        }
      }

      .top-elements {
        display: flex;
        color: $primary-dark;
        font-weight: 700;
        font-size: $font-size-xs;

        > div:not(:first-of-type) {
          margin-left: 15px;
        }
      }

      .title {
        font-weight: 700;
        font-size: $font-size-5xl;
        line-height: $line-height-tight;
        display: -webkit-box;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;
        overflow: hidden;
        width: 100%;
      }

      .purpose {
        font-weight: 400;
        font-size: $font-size-l;
        display: -webkit-box;
        -webkit-line-clamp: 3;
        -webkit-box-orient: vertical;
        overflow: hidden;
        width: 100%;
      }

      .tag-ctn-skeleton {
        margin: 0;
        margin-top: $space-l;
        display: flex;
        flex-wrap: nowrap;
        gap: $space-2xs;
        overflow: hidden;
      }

      $sdg-size: pxToRem(38px);

      .sdg-link {
        width: $sdg-size;
        height: $sdg-size;
        display: inline-block;
        transition: all 0.2s ease-in-out;

        @media screen and (max-width: $min-tablet) {
          margin-bottom: $space-l;
        }

        &:hover {
          transform: scale(1.2);
        }
      }

      .sdg {
        width: 100%;
        height: 100%;
      }

      .sdg-enter-active,
      .sdg-leave-active {
        transition: transform 0.4s ease;
        transform-origin: center center;
        transform: scale(1) translateY(0);
      }

      .sdg-enter-from,
      .sdg-leave-to {
        transform: scale(0) translateY(200%);
      }

      .tag-list {
        margin-top: $space-l;
        margin-bottom: $space-l;

        @media screen and (max-width: $min-tablet) {
          margin-top: 0;
          margin-bottom: 0;
        }
      }

      .tag-list + .sdg-ctn {
        margin-top: $space-l;
      }

      .sdg-ctn a:not(:first-of-type) {
        margin-left: $space-m;
      }
    }

    .contact-ctn {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-top: $space-m;
      padding-left: pxToRem(150px);

      .right {
        display: flex;
        align-items: center;

        .social-icon-ctn {
          display: flex;
          align-items: center;

          > * {
            height: 17px;
            margin-right: 15px;
            fill: $primary-dark;
            cursor: pointer;
          }
        }
      }

      button {
        text-transform: uppercase;
      }
    }
  }
}

@media screen and (min-width: $min-tablet) {
  .project-header-ctn {
    z-index: 1;

    &:not(.moreInfo) {
      padding-bottom: $space-2xl;
    }

    .main-info-ctn {
      .edit-btn-desktop {
        display: flex;
        position: absolute;
        top: pxToRem(-15px);
        right: pxToRem(20px);
        z-index: 1;
        background-color: $primary-dark;
      }

      .edit-btn-mobile {
        display: none;
      }
    }
  }
}

@media screen and (max-width: $min-tablet) {
  .project-header-ctn {
    .img-position {
      display: flex;
      flex-direction: column;
      align-items: center;
    }

    .main-info-ctn {
      .edit-btn-desktop {
        display: none;
      }

      .edit-btn-mobile {
        display: flex;
        position: absolute;
        top: pxToRem(-15px);
        right: pxToRem(20px);
        z-index: 1;
        background-color: $primary-dark;
      }
    }
  }
}

@media screen and (max-width: $min-tablet) {
  .project-header-ctn {
    .organizations-grid,
    .content-ctn .main-info-ctn .overflowing-badges .quantity-text-badge,
    .creation-date,
    .content-ctn .contact-ctn .right .social-icon-ctn,
    .tag-list-desktop,
    .img-ctn,
    .visibility-desktop {
      display: none;
    }

    .content-ctn .main-info-ctn > h1 {
      font-size: $font-size-4xl;
    }

    .tag-list-mobile {
      display: block;
      margin-bottom: $space-l;
    }

    .img-position {
      display: flex;
    }

    .content-ctn {
      left: 0;
      padding: 0;
      display: flex;
      flex-flow: column wrap;
      align-items: center;
      margin-top: 0;

      .main-info-ctn {
        width: 100%;
        box-sizing: border-box;
        display: block;
      }

      .contact-ctn {
        padding-left: 0;
        justify-content: center;

        .right {
          margin-left: pxToRem(10px);
        }
      }
    }
  }
}

@media screen and (min-width: $min-tablet) {
  h4.skeleton {
    width: 400px;
  }
}

@media screen and (min-width: $min-tablet) {
  h4.skeleton {
    width: 500px;
  }
}

@media screen and (min-width: $min-desktop) {
  h4.skeleton {
    width: 700px;
  }
}

.icon {
  width: 24px;
  fill: $white;
  cursor: pointer;
  border: 1px solid $primary-dark;
  border-radius: 50%;
  background-color: $primary-dark;

  &--open {
    position: absolute;
    bottom: 8px;
    right: 8px;
  }

  &.title-chevron {
    margin-bottom: 10px;
  }

  &.purpose-chevron {
    margin-bottom: 3px;
  }
}

.skeleton-block {
  margin-top: 12px;
}

.more-info-block {
  background-color: $primary-lighter;
  margin-top: -20px;
  padding-top: 40px;
  padding-left: 40px;
  padding-bottom: 30px;
  display: flex;
  border-bottom-left-radius: $border-radius-l;
  border-bottom-right-radius: $border-radius-l;

  .vertical-line {
    border-left: 6px solid $primary-dark;
    display: flex;
    flex-direction: column;
    padding-left: 20px;
    padding-right: 50px;
    width: 80%;
  }

  .close-button {
    height: 100%;
    width: 20%;
    padding-right: 25px;
  }
}

@media screen and (max-width: $min-tablet) {
  .more-info-block {
    padding-inline: 20px;
    width: 100%;
    margin-bottom: 0;

    .vertical-line {
      padding-right: 0;
      width: 100%;
    }
  }
}

@media screen and (min-width: $max-tablet) {
  .tag-list-desktop {
    display: block;
  }
}
</style>
