<template>
    <div class="project-card-wrapper">
        <div
            class="project-card"
            :class="{
                'project-card--horizontal': horizontalDisplay,
                'project-card--preview': previewMode,
            }"
        >
            <div class="project-card__main">
                <ProjectIcon
                    v-if="!horizontalDisplay"
                    class="project-icon"
                    :class="{ 'project-icon--preview': previewMode }"
                    :privacy-icon-visible="privacyIconVisible"
                    :project="project"
                />

                <CategoryBadge
                    v-if="project.categories && project.categories.length"
                    class="category-badge"
                    :class="{ 'category-badge--preview': previewMode }"
                    :horizontal-display="horizontalDisplay"
                    :privacy-icon-visible="privacyIconVisible"
                    :project="project"
                />

                <div class="image-section" :class="{ 'image-section--preview': previewMode }">
                    <img
                        v-if="project.header_image && project.header_image.variations"
                        :alt="`${project.title} image`"
                        :src="project.header_image.variations.small"
                        class="image"
                    />

                    <PatatoidIcon v-else background="#00dba7" class="image" fill="#c2fff0" />

                    <OrganizationsGrid
                        v-if="showOrganizationsGrid"
                        :dir="project.organizations.length <= 6 ? 'rtl' : 'ltr'"
                        :project="project"
                        class="organizations-grid"
                    />
                </div>

                <div class="project-content" :class="{ 'project-content--preview': previewMode }">
                    <div class="project-content__title">{{ project.title }}</div>

                    <div class="project-content__purpose custom-scrollbar">
                        {{ project.purpose }}

                        <div v-if="project.wikipedia_tags" class="tag-ctn">
                            <div v-for="tag in project.wikipediaTags" :key="tag.name" class="tag">
                                {{ tag.name }}
                            </div>
                        </div>

                        <div v-if="longPurpose && !previewMode" class="gradient"></div>
                    </div>

                    <button
                        v-if="horizontalDisplay"
                        class="project-content__button"
                        @click="toProject(project)"
                    >
                        {{ $t('project.view') }}
                    </button>
                </div>

                <span
                    v-if="!horizontalDisplay && longPurpose"
                    @click="togglePreviewMode"
                    class="angle-down-icon"
                >
                    <IconImage name="ChevronDown" />
                </span>
            </div>

            <ProjectButtons
                v-if="!horizontalDisplay"
                :is-preview-mode="previewMode"
                :long-purpose="longPurpose"
                @access-project="toProject(project)"
                @toggle-preview-mode="togglePreviewMode"
            />
        </div>
    </div>
</template>

<script>
import PatatoidIcon from '@/components/svgs/PatatoidIcon.vue'
import IconImage from '@/components/svgs/IconImage.vue'
import ProjectIcon from './ProjectIcon.vue'
import CategoryBadge from '../CategoryBadge/CategoryBadge.vue'
import OrganizationsGrid from '../OrganizationsGrid/OrganizationsGrid.vue'
import ProjectButtons from './ProjectButtons.vue'

export default {
    name: 'ProjectCard',

    components: {
        ProjectIcon,
        CategoryBadge,
        OrganizationsGrid,
        PatatoidIcon,
        IconImage,
        ProjectButtons,
    },

    data() {
        return {
            previewMode: false,
        }
    },

    props: {
        project: {
            type: Object,
            required: true,
        },

        horizontalDisplay: {
            type: Boolean,
            default: false,
        },

        privacyIconVisible: {
            type: Boolean,
            default: false,
        },
    },

    methods: {
        togglePreviewMode() {
            this.previewMode = !this.previewMode
        },

        toProject(project) {
            const slugOrId = project.slug ? project.slug : project.id
            this.$router.push(`/projects/${slugOrId}/summary`)
        },
    },

    computed: {
        longPurpose() {
            return this.project.purpose.length > 120
        },

        showOrganizationsGrid() {
            return (
                !this.horizontalDisplay &&
                this.project.organizations &&
                this.project.organizations.length
            )
        },
    },
}
</script>

<style lang="scss" scoped>
.project-card-wrapper {
    position: relative;
    width: fit-content;
    min-height: 100%;
    display: flex;
}

.project-card {
    border: $border-width-l solid $primary-dark;
    border-radius: $border-radius-l;
    color: $black;
    overflow: hidden;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    max-width: 287px;
    max-height: 447px;
    background: $white;
    transition: all 0.8s ease-in-out;

    &__main {
        display: flex;
        flex-direction: column;
        max-height: 400px;
    }

    &--preview {
        background: $primary-lighter;
    }

    &--horizontal {
        max-width: unset;

        .project-card__main {
            flex-direction: row;
            align-items: stretch;
            height: 200px;
        }

        .category-badge {
            top: -16px;
        }

        .image-section {
            height: 100%;
            width: 200px;
            flex-shrink: 0;

            .image {
                height: 100%;
                min-width: 142px;
            }
        }

        .project-content {
            text-align: left;
            border-top: none;
            padding: $space-m;

            &__purpose {
                max-height: pxToRem(70px);
                padding-left: 0;
            }
        }

        .buttons {
            display: none;
        }

        &:hover {
            .project-content {
                background: $primary-lighter;

                .gradient {
                    opacity: 0;
                }
            }
        }
    }
}

.project-icon {
    position: absolute;
    top: 18px;
    left: 28px;
    z-index: 1;
    transition: all 0.8s ease-in-out;
    box-sizing: border-box;

    &--preview {
        top: -14px;
    }
}

.category-badge {
    position: absolute;
    left: 50%;
    top: 175px;
    transform: translateX(-50%);

    &--preview {
        top: -16px;
    }
}

.image-section {
    position: relative;
    transition: all 0.8s ease-in-out;
    height: 187px;
    flex-shrink: 0;
    overflow: hidden;

    .image {
        max-width: 100%;
        min-height: 196px;
        object-fit: cover;
    }

    .organizations-grid {
        position: absolute;
        top: 15px;
        right: 15px;
    }

    &--preview {
        transform: translateY(-196px);
        height: 0;
    }
}

.project-content {
    text-align: center;
    padding: $space-s;
    border-top: 3px solid $primary-dark;
    min-height: 175px;
    transition: all 0.8s ease-in-out;
    background: $white;

    &__title {
        font-weight: bold;
        font-size: $font-size-xl;
        margin: $space-m 0 $space-s;
    }

    &__purpose {
        max-height: 95px;
        overflow: hidden;
        position: relative;
        transition: all 0.8s ease-in-out;
        padding: 10px;

        .gradient {
            position: absolute;
            opacity: 1;
            transition: opacity 0.8s ease-in-out;
            top: 0;
            left: 0;
            height: 100%;
            width: 100%;
            background: linear-gradient(
                180deg,
                rgb(255 255 255 / 0%) 0%,
                rgb(255 255 255 / 10%) 70%,
                rgb(255 255 255 / 85%) 85%,
                rgb(255 255 255 / 100%) 100%
            );
            pointer-events: none;
        }

        .tag-ctn {
            margin-top: $space-m;

            .tag {
                text-transform: uppercase;
                background: $primary-lighter;
                color: $primary-dark;
                font-weight: bold;
                font-size: $font-size-2xs;
                margin: 3px 5px;
            }
        }
    }

    &__button {
        text-transform: uppercase;
        background: $transparent;
        color: $primary-dark;
        font-weight: bold;
        font-size: $font-size-m;
        border: none;
        cursor: pointer;
        margin-top: 20px;
        padding: 0;
    }

    &--preview {
        transform: translateY(-6px);
        background: $primary-lighter;
        flex-grow: 1;

        .project-content__purpose {
            overflow: scroll;
            max-height: 291px;
            overflow-x: hidden;

            .tag {
                background: $white;
            }

            .gradient {
                opacity: 0;
            }
        }
    }
}

.angle-down-icon {
    margin-bottom: $space-s;
    width: 9px;
    display: block;
    fill: $primary-dark;
    align-self: center;
    cursor: pointer;
}

@media screen and (width <= 768px) {
    .project-icon {
        top: -14px;
    }

    .category-badge {
        top: -16px;
    }

    .image-section {
        display: none;
    }

    .project-content {
        border-top: none;
    }
}
</style>
