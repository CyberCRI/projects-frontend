<template>
  <div class="whole-content">
    <div :class="{ loading, moreInfo }" class="project-header-ctn">
      <div class="img-position">
        <ProjectHeaderImage class="img-mobile-ctn" :project="project" :loading="loading" />
      </div>
      <div class="content-ctn">
        <div :class="{ 'has-sdg': sdgs?.length }" class="main-info-ctn">
          <div class="img-block">
            <ProjectHeaderImage class="img-ctn" :project="project" :loading="loading" />
          </div>
          <div class="text-content">
            <ProjectHeaderTitle class="title-block" :project="project" :loading="loading" />

            <ProjectHeaderTagList
              class="tag-list-desktop"
              :project="project"
              :loading="loading"
              tag-prefix="desktop"
            />

            <ProjectHeaderPurpose
              v-if="showPurposeWithEmptyContent"
              class="purpose-block"
              :project="project"
              :loading="loading"
            />

            <div v-if="mobileScreen" class="tag-list-mobile">
              <ProjectHeaderTagList :project="project" :loading="loading" tag-prefix="mobile" />
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

            <ProjectHeaderSdgList :sdgs="sdgs" :loading="loading" class="sdg-ctn" />

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
  },

  mounted() {
    window.addEventListener('click', this.onClick)
  },

  unmounted() {
    window.removeEventListener('click', this.onClick)
  },

  methods: {
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
.whole-content {
  display: block !important;
}

.project-header-ctn {
  position: relative;

  .visibility {
    font-weight: 700;
    font-size: 14px;
    line-height: $line-height-compact;
    color: $primary-dark;
  }

  .visibility-desktop {
    margin-bottom: 20px;
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
    .visibility-mobile {
      display: none;
    }

    .tag-list-desktop,
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
    }
  }
}

@media screen and (min-width: $min-tablet) {
  .project-header-ctn {
    z-index: 1;

    &:not(.moreInfo) {
      padding-bottom: $space-2xl;
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
  }
}

@media screen and (max-width: $min-tablet) {
  .project-header-ctn {
    .content-ctn .main-info-ctn .overflowing-badges .quantity-text-badge,
    .tag-list-desktop,
    .img-ctn,
    .visibility-desktop {
      display: none;
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
    }
  }
}

@media screen and (min-width: $max-tablet) {
  .tag-list-desktop {
    display: block;
  }
}
</style>
