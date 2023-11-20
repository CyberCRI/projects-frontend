<template>
    <div class="whole-content">
        <div class="edit-button-ctn">
            <LpiButton
                v-if="!loading && canEditProject"
                :label="$t('project.edit')"
                left-icon="Pen"
                size="link"
                @click="editProject"
                data-test="header-project-button"
            />
        </div>
        <div :class="{ loading, moreInfo }" class="project-header-ctn">
            <div class="img-position">
                <div class="img-mobile-ctn">
                    <SkeletonComponent v-if="loading || !imageLoaded" height="100%" width="100%" />

                    <CroppedImage
                        v-if="
                            !loading &&
                            project &&
                            project.header_image &&
                            project.header_image.variations
                        "
                        ref="projectImg"
                        :alt="`${project.title} image`"
                        :src="
                            imageError
                                ? `${this.PUBLIC_BINARIES_PREFIX}/placeholders/header_placeholder.png`
                                : project.header_image.variations.medium
                        "
                        @error="placeHolderImg"
                        @load="onImageLoaded"
                        :image-sizes="imageError ? null : imageSizes"
                    />
                </div>
            </div>
            <div class="content-ctn">
                <div
                    :class="{ 'has-sdg': project && project.sdgs && project.sdgs.length }"
                    class="main-info-ctn"
                >
                    <div class="img-block">
                        <div class="img-ctn">
                            <SkeletonComponent
                                v-if="loading || !imageLoaded"
                                height="100%"
                                width="100%"
                            />

                            <CroppedImage
                                v-if="
                                    !loading &&
                                    project &&
                                    project.header_image &&
                                    project.header_image.variations
                                "
                                ref="projectImg"
                                :alt="`${project.title} image`"
                                :src="
                                    imageError
                                        ? `${this.PUBLIC_BINARIES_PREFIX}/placeholders/header_placeholder.png`
                                        : project.header_image.variations.medium
                                "
                                @error="placeHolderImg"
                                @load="onImageLoaded"
                                :image-sizes="imageError ? null : imageSizes"
                            />
                        </div>
                    </div>
                    <div class="text-content">
                        <div
                            v-if="project && project.categories && project.categories.length"
                            class="breadcrumb-desktop"
                        >
                            <SkeletonComponent
                                v-if="loading"
                                class="skeleton-block"
                                height="60px"
                            />
                            <div v-else class="breadcrumb">
                                {{ breadCrumb }}
                            </div>
                        </div>
                        <SkeletonComponent
                            v-if="loading"
                            class="skeleton-block"
                            height="42px"
                            tag="h1"
                        />
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
                            <div
                                v-if="project && project.title && showFullTitle"
                                class="full-title-block"
                            >
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
                                v-else-if="
                                    project &&
                                    (project.organization_tags.length ||
                                        project.wikipedia_tags.length)
                                "
                                :organization-tags="organizationTags"
                                :wikipedia-tags="wikipediaTags"
                                class="tag-list"
                                prefix="desktop"
                            />
                        </div>
                        <SkeletonComponent v-if="loading" class="skeleton-block" height="24px" />
                        <div v-else-if="showPurposeWithEmptyContent" class="purpose-block">
                            <h4
                                v-if="project && project.purpose"
                                id="project-purpose"
                                class="purpose"
                            >
                                {{ capitalizedPurpose }}
                            </h4>
                            <IconImage
                                v-if="showFullPurposeIcon"
                                class="icon purpose-chevron"
                                name="ChevronDown"
                                @click="showFullPurpose = !showFullPurpose"
                            />
                            <div
                                v-if="project && project.purpose && showFullPurpose"
                                class="full-title-block"
                            >
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
                                v-else-if="
                                    project &&
                                    (project.organization_tags.length ||
                                        project.wikipedia_tags.length)
                                "
                                :organization-tags="organizationTags"
                                :wikipedia-tags="wikipediaTags"
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

                        <div
                            class="sdg-ctn"
                            v-show="!loading && project && project.sdgs && project.sdgs.length"
                        >
                            <TransitionGroup name="sdg" tag="div">
                                <router-link
                                    v-for="sdg in project?.sdgs || []"
                                    :key="sdg"
                                    :to="browsePageWithQuery('sdgs', sdg)"
                                    class="sdg-link"
                                >
                                    <img
                                        :alt="sdg"
                                        :src="`${PUBLIC_BINARIES_PREFIX}/sdgs/logo/SDG-${sdg}.svg`"
                                        class="sdg"
                                    />
                                </router-link>
                            </TransitionGroup>
                        </div>

                        <div
                            v-if="project && project.categories && project.categories.length"
                            class="breadcrumb-mobile"
                        >
                            <SkeletonComponent
                                v-if="loading"
                                class="skeleton-block"
                                height="46px"
                            />
                            <div v-else class="breadcrumb">
                                {{ breadCrumb }}
                            </div>
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

                    <div v-if="!loading" class="project-actions-ctn">
                        <div class="end-buttons">
                            <ExternalLabelButton
                                v-if="$store.getters['users/isLoggedIn']"
                                class="space-button"
                                :label="followed ? $t('project.followed') : $t('project.follow')"
                                :right-icon="followed ? 'Heart' : 'HeartOutline'"
                                :top-icon="true"
                                :no-border="true"
                                :bold="true"
                                button-size="mbutton"
                                @click="toggleFollow"
                            />
                            <ExternalLabelButton
                                v-if="
                                    project && project.announcements && project.announcements.length
                                "
                                class="space-button article-button"
                                :label="$t('group.news')"
                                right-icon="Article"
                                :top-icon="true"
                                :no-border="true"
                                :bold="true"
                                :nb-button="project.announcements.length.toString()"
                                button-size="mbutton"
                                @click="$emit('show-project-announcements')"
                            />
                            <ExternalLabelButton
                                class="space-button"
                                :label="$filters.capitalize($t('comment.comment-verb'))"
                                right-icon="ChatBubble"
                                :top-icon="true"
                                :no-border="true"
                                :bold="true"
                                button-size="mbutton"
                                @click="goToCommentView"
                            />
                            <ToolTip
                                class="share-tip shadowed"
                                placement="bottom"
                                trigger="clickToOpen"
                            >
                                <template #custom-content>
                                    <div class="share-ctn">
                                        <button @click="facebookShare">
                                            <IconImage name="Facebook" />
                                        </button>
                                        <button @click="twitterShare">
                                            <IconImage name="Twitter" />
                                        </button>
                                        <button @click="linkedinShare">
                                            <IconImage name="Linkedin" />
                                        </button>
                                    </div>
                                </template>
                                <ExternalLabelButton
                                    class="space-button"
                                    :label="$t('group.share')"
                                    right-icon="Share"
                                    :top-icon="true"
                                    :no-border="true"
                                    :bold="true"
                                    button-size="mbutton"
                                />
                            </ToolTip>
                            <ExternalLabelButton
                                v-if="moreInfo"
                                class="space-button"
                                :label="$t('group.less')"
                                right-icon="ChevronUp"
                                :no-border="true"
                                :no-margin="true"
                                :bold="true"
                                @click="displayLessInfo"
                            />
                            <ExternalLabelButton
                                v-else
                                id="more-info-btn"
                                class="space-button"
                                :label="$t('group.more')"
                                right-icon="ChevronDown"
                                :no-border="true"
                                :no-margin="true"
                                :bold="true"
                                @click="displayMoreInfo"
                            />
                        </div>
                    </div>
                </div>
            </div>
            <div v-if="moreInfo" class="more-info-block">
                <div class="vertical-line">
                    <InfoSentence
                        v-for="(info, index) in infoArray"
                        :key="index"
                        :data="info"
                        size="medium"
                        button-size="mbutton"
                        @similar="info.link"
                    />
                </div>
                <ExternalLabelButton
                    class="close-button"
                    :label="$t('header.close')"
                    left-icon="Close"
                    :no-border="true"
                    :no-margin="true"
                    :bold="true"
                    @click="displayLessInfo"
                />
            </div>
        </div>
    </div>
</template>

<script>
import SkeletonComponent from '@/components/lpikit/Skeleton/SkeletonComponent.vue'
import LpiButton from '@/components/lpikit/LpiButton/LpiButton.vue'
import ExternalLabelButton from '@/components/lpikit/LpiButton/ExternalLabelButton.vue'
import IconImage from '@/components/svgs/IconImage.vue'
import ToolTip from '@/components/lpikit/ToolTip/ToolTip.vue'
import permissions from '@/mixins/permissions.ts'
import TagsList from './TagsList.vue'
import imageMixin from '@/mixins/imageMixin.ts'
import CroppedImage from '@/components/lpikit/CroppedImage/CroppedImage.vue'
import InfoSentence from '@/components/lpikit/ProjectHeader/InfoSentence.vue'
import { postFollow as addFollow, deleteFollow } from '@/api/follows.service'

export default {
    name: 'ProjectHeader',

    emits: ['show-project-announcements'],

    components: {
        SkeletonComponent,
        ExternalLabelButton,
        IconImage,
        ToolTip,
        TagsList,
        CroppedImage,
        InfoSentence,
        LpiButton,
    },

    inject: ['projectLayoutToggleAddModal', 'projectLayoutGoToTab'],

    mixins: [permissions, imageMixin],

    props: {
        project: {
            type: Object,
            default: () => {},
        },

        similarProjects: {
            type: Array,
            default: () => [],
        },
        loading: {
            type: Boolean,
            default: true,
        },
    },

    mounted() {
        let _this = this
        window.addEventListener('resize', this.setToggleIcon)
        window.addEventListener('click', function (e) {
            if (_this.plusButton > 0) {
                _this.plusButton += 1
            }
            let moreInfo = document.querySelector('.more-info-block')
            if (
                _this.moreInfo &&
                _this.plusButton > 2 &&
                moreInfo &&
                (!moreInfo.contains(e.target) ||
                    (!e.target.closest('.tag-elt-show-more') &&
                        (e.target.closest('.tag-elt') || e.target.closest('.extra-tag-elt'))))
            ) {
                _this.moreInfo = false
                _this.plusButton = 0
            }
        })
    },

    unmounted() {
        window.removeEventListener('resize', this.setToggleIcon)
        window.removeEventListener('click', this.onClick)
    },

    data() {
        return {
            sharedUrl: window.location.origin,
            imageLoaded: false,
            imageAlertDismissed: false,
            nonSquareImage: false,
            showFullTitle: false,
            showFullPurpose: false,
            showFullTitleIcon: false,
            showFullPurposeIcon: false,
            imageError: false,
            moreInfo: false,
            plusButton: 0,
            follow: (this.project && this.project.is_followed) || false,
        }
    },

    computed: {
        organizationTags() {
            return this.project.organization_tags
        },

        wikipediaTags() {
            return this.project.wikipedia_tags
        },

        showPurposeWithEmptyContent() {
            return (
                this.project && this.project.purpose !== '   ' && this.project.purpose.length !== 0
            )
        },

        imageSizes() {
            if (
                this.project &&
                this.project.header_image &&
                this.project.header_image.scale_x &&
                this.project.header_image.scale_y &&
                this.project.header_image.natural_ratio
            ) {
                return {
                    scaleX: this.project.header_image.scale_x,
                    scaleY: this.project.header_image.scale_y,
                    naturalRatio: this.project.header_image.natural_ratio,
                    left: this.project.header_image.left || 0,
                    top: this.project.header_image.top || 0,
                }
            }
            return null
        },
        breadCrumb() {
            let breadcrumb = '# '
            let start = true
            let ret = this.constructString(this.project.categories, 'name')
            for (let word = 0; word < ret.length; word++) {
                if (!start) {
                    breadcrumb += '; '
                }
                breadcrumb += ret[word]
                start = false
            }
            return breadcrumb
        },
        similarProjectStr() {
            let nb = this.similarProjects ? this.similarProjects.length : 0
            let similarProjectsStr = ''
            if (nb > 1) {
                similarProjectsStr = 'header.similar-projects'
            } else {
                similarProjectsStr = 'header.similar-project'
            }
            let infos = ''
            if (nb) {
                infos = this.constructString(this.similarProjects, 'title', '/projects/', 'slug')
            }

            return {
                icon: 'projects.svg',
                number: nb + ' ',
                title: similarProjectsStr,
                info: infos,
                cloud: true,
                internal: true,
                badge: true,
            }
        },

        portals() {
            let nb = this.project.organizations ? this.project.organizations.length : 0
            let portalStrStart = 'header.portals-start'
            let portalStrEnd = ''
            if (nb > 1) {
                portalStrEnd = 'header.portals-end-plural'
            } else {
                portalStrEnd = 'header.portals-end-singular'
            }
            let infos = null
            if (this.project.organizations.length) {
                infos = this.constructString(this.project.organizations, 'name', '', 'website_url')
            }

            return {
                icon: 'Earth',
                title: portalStrEnd,
                number: ' ' + nb + ' ',
                preTitle: portalStrStart,
                info: infos,
                internal: false,
                badge: true,
            }
        },

        views() {
            let viewField = 'header.views'
            let nbViews = this.project.views
            let creationDate = 'header.creation'
            let info2 = new Date(this.project.created_at).toLocaleDateString()
            let updatedDate = 'header.update'
            let info3 = new Date(this.project.updated_at).toLocaleDateString()
            return {
                icon: 'Poll',
                title: viewField,
                info1: [nbViews],
                title2: creationDate,
                info2: info2,
                title3: updatedDate,
                info3: info3,
                type: 'views',
                badge: false,
            }
        },
        infoArray() {
            let array = []
            array.push(this.similarProjectStr)
            array.push(this.portals)
            array.push(this.views)
            return array
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
            return window.innerWidth
        },
        mobileScreen() {
            return this.screenWidth <= 768
        },
        capitalizedTitle() {
            if (this.project && this.project.title) {
                return this.project.title[0].toUpperCase() + this.project.title.slice(1)
            }
            return null
        },
        capitalizedPurpose() {
            if (this.project && this.project.purpose) {
                return this.project.purpose[0].toUpperCase() + this.project.purpose.slice(1)
            }
            return null
        },
        followed() {
            return this.follow && this.follow.is_followed
        },
    },
    watch: {
        imageLoaded(neo, old) {
            if (neo && neo !== old) {
                const img =
                    this.$refs.projectImg &&
                    this.$refs.projectImg.$el &&
                    this.$refs.projectImg.$el.querySelector('img')
                if (img && img.naturalWidth && img.naturalHeight) {
                    const ratio = img.naturalWidth / img.naturalHeight
                    // float precision
                    this.nonSquareImage = Math.abs(ratio - 1) > 0.05
                }
            }
        },

        loading() {
            this.setToggleIcon()
        },
    },

    methods: {
        editProject() {
            this.projectLayoutToggleAddModal('project')
        },

        setToggleIcon() {
            this.$nextTick(() => {
                const title = document.getElementById('project-title')
                const purpose = document.getElementById('project-purpose')

                this.showFullTitleIcon = title
                    ? title.scrollHeight > title.clientHeight ||
                      title.scrollHeight > title.clientHeight
                    : false

                this.showFullPurposeIcon = purpose
                    ? purpose.scrollHeight > purpose.clientHeight ||
                      purpose.scrollHeight > purpose.clientHeight
                    : false
            })
        },

        placeHolderImg() {
            this.imageError = true
            this.imageLoaded = true
        },

        onImageLoaded() {
            this.imageLoaded = true
        },

        browsePageWithQuery(queryField, queryValue) {
            return {
                path: '/search',
                query: {
                    [queryField]: queryValue,
                },
            }
        },

        async toggleFollow() {
            if (this.follow && this.follow.is_followed) {
                await deleteFollow({
                    follower_id: this.follow.follow_id,
                    project_id: this.project.id,
                })
                this.follow.is_followed = false
            } else {
                const result = await addFollow({
                    follower_id: this.$store.state.users.keycloak_id,
                    project_id: this.project.id,
                })
                this.follow = result.project.is_followed
            }
        },

        goToCommentView() {
            this.projectLayoutGoToTab('comments')
        },

        displayMoreInfo() {
            this.moreInfo = true
            this.plusButton = 1
        },

        displayLessInfo() {
            this.moreInfo = false
            this.plusButton = 0
        },

        facebookShare() {
            window.open(`https://www.facebook.com/sharer/sharer.php?u=${this.sharedUrl}`)
        },
        twitterShare() {
            window.open(`https://twitter.com/intent/tweet?url=${this.sharedUrl}&text=`)
        },
        linkedinShare() {
            window.open(`https://www.linkedin.com/shareArticle?mini=true&url=${this.sharedUrl}`)
        },

        /* TODO: Put this back once we figured out to who are we supposed to write to */
        // mailTo() {
        //     window.open('mailto:projects.platform@learningplanetinstitute.org')
        // },

        constructString(infos, field, prefix = '', link = null) {
            let ret = []
            for (let i = 0; i < infos.length; i++) {
                let name = infos[i][field]
                if (link) {
                    let direction = prefix.concat(infos[i][link])
                    ret.push({
                        name: name,
                        direction: direction,
                    })
                } else {
                    ret.push(name)
                }
            }
            return ret
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
:deep(.share-tip .trigger) {
    text-align: right;
}

.whole-content {
    display: block !important;
}

.edit-button-ctn {
    margin-top: $space-l;
    padding-bottom: $space-l;
    width: 100%;
    display: flex;
    justify-content: flex-end;

    @media screen and (max-width: $min-tablet) {
        margin-bottom: $space-l;
        margin-top: unset;
    }
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
            line-height: 1.2;
        }
    }

    .full-purpose {
        font-weight: 400;
        font-size: $font-size-m;
        line-height: 24px;
    }

    .breadcrumb {
        font-weight: 700;
        font-size: 14px;
        line-height: 16px;
        color: $primary-dark;
    }

    .visibility {
        font-weight: 700;
        font-size: 14px;
        line-height: 16px;
        color: $primary-dark;
    }

    .visibility-desktop {
        margin-bottom: 20px;
    }

    @media screen and (max-width: $min-tablet) {
        .breadcrumb {
            margin-bottom: 14px;
        }

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
        .breadcrumb-mobile,
        .more-info-block-mobile,
        .visibility-mobile {
            display: none;
        }

        .tag-list-desktop,
        .breadcrumb-desktop,
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
                border: $border-width-s solid $green;
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
                    border: $border-width-s solid $green;
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
                        background: $green-dark;
                        color: $white;
                        height: 100%;
                        border-right: $border-width-s solid $green;
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
                line-height: 1.2;
                display: -webkit-box;
                -webkit-line-clamp: 2;
                -webkit-box-orient: vertical;
                overflow: hidden;
                width: 100%;
            }

            .purpose {
                font-weight: 400;
                font-size: $font-size-l;
                line-height: 1.4;
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

        .project-actions-ctn {
            display: flex;
            flex-direction: column;
            justify-content: center;
            background: $green-lighter;
            border-radius: 0 $border-radius-l $border-radius-l 0;

            @media screen and (max-width: $min-tablet) {
                margin: 0 pxToRem(5px);
            }

            @media screen and (min-width: $min-tablet) {
                align-items: center;
            }

            .end-buttons {
                display: flex;
                flex-direction: column;
                justify-content: space-evenly;

                .space-button {
                    margin-top: 15px;
                    margin-bottom: 15px;
                }

                @media screen and (max-width: $min-tablet) {
                    margin-block: 0;
                }

                .article-button {
                    height: 50px;
                }
            }

            button {
                border: none;
                background: none;
            }

            .share-ctn {
                display: flex;
                align-items: center;
                justify-content: space-between;
                gap: $space-m;
                z-index: 1;

                svg {
                    width: 24px;
                    fill: $primary-dark;
                    cursor: pointer;
                }
            }
        }

        @media screen and (max-width: $min-tablet) {
            .project-actions-ctn {
                position: static;
                flex-direction: row;
                top: 0;
                transform: translateY(0);
                margin-top: 40px;
                height: 66px;
                align-items: center;
                border-radius: $border-radius-l;
                border: $border-width-s solid $green;
                padding-inline: $space-l;

                .end-buttons {
                    flex-direction: row;
                    width: 100%;

                    .space-button {
                        margin-right: 15px;
                        margin-left: 15px;
                    }

                    @media screen and (max-width: $min-tablet) {
                        .space-button {
                            margin-right: 5px;
                            margin-left: 5px;
                        }
                    }
                }
            }
        }

        @media screen and (min-width: $min-tablet) {
            .project-actions-ctn {
                padding-inline: 15px;
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
        .breadcrumb-desktop,
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

        .breadcrumb-mobile {
            display: block;
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
    border-bottom-left-radius: $border-radius-20;
    border-bottom-right-radius: $border-radius-20;

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
