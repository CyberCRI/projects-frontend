<template>
    <div>
        <div v-if="project" class="project-description">
            <aside>
                <h1 class="project-title-recall" v-if="isSummarySticked">{{ project.title }}</h1>
                <div v-if="showEditButton" class="description-edit">
                    <span
                        class="edit-description-button white-bg"
                        @click="editDescriptionModalActive = !editDescriptionModalActive"
                        data-test="edit-description"
                    >
                        <IconImage class="icon" name="Pen" />
                    </span>
                </div>
                <DescriptionSummaryBlock
                    :description="true"
                    class="summary"
                    summary-text-container=".description-content"
                    @item-clicked="scrollToSection"
                    :anchor-offset="anchorOffset"
                    @decription-summary-rendered="onSummaryRendered"
                />
            </aside>

            <DescriptionPlaceholder
                v-if="canEditProject && showDescriptionPlaceHolder"
                :project="project"
            ></DescriptionPlaceholder>

            <TipTapOutput v-else class="description-content" :content="description" />
        </div>

        <DescriptionDrawer
            :is-opened="editDescriptionModalActive"
            :project="updatedProject"
            @close="close"
        />
    </div>
</template>

<script>
import DescriptionSummaryBlock from '@/components/project/description/DescriptionSummaryBlock.vue'
import DescriptionDrawer from '@/components/project/description/DescriptionDrawer.vue'
import permissions from '@/mixins/permissions.ts'
import DescriptionPlaceholder from '@/components/project/description/DescriptionPlaceholder.vue'
import utils from '@/functs/functions.ts'
import TipTapOutput from '@/components/base/form/TextEditor/TipTapOutput.vue'
import throttle from 'lodash.throttle'
import IconImage from '@/components/base/media/IconImage.vue'
import useProjectsStore from '@/stores/useProjects.ts'

export default {
    name: 'ProjectDescriptionTab',

    components: {
        DescriptionDrawer,
        DescriptionSummaryBlock,
        DescriptionPlaceholder,
        IconImage,
        TipTapOutput,
    },

    mixins: [permissions],
    setup() {
        const projectsStore = useProjectsStore()
        useScrollToTab()
        return {
            projectsStore,
        }
    },
    props: {
        project: {
            type: Object,
            default: () => {},
        },
    },

    data() {
        return {
            editDescriptionModalActive: false,
            anchorOffset: 0,
            isSummarySticked: false,
        }
    },

    mounted() {
        this.computeAnchorOffset()
        // in unit tests, window might be undefined
        window?.addEventListener('resize', this.computeAnchorOffset)
        window?.addEventListener('resize', this.checkIfSummaryIsSticked)
        window?.addEventListener('scroll', this.checkIfSummaryIsSticked)
    },

    beforeUnmount() {
        // in unit tests, window might be undefined
        window?.removeEventListener('resize', this.computeAnchorOffset)
        window?.addEventListener('resize', this.checkIfSummaryIsSticked)
        window?.addEventListener('scroll', this.checkIfSummaryIsSticked)
    },

    methods: {
        close() {
            this.editDescriptionModalActive = !this.editDescriptionModalActive
        },
        scrollToSection(target) {
            utils.scrollTo(document.getElementById(`anchor-${target}`))
        },
        computeAnchorOffset: throttle(function () {
            if (!this) return // safeguard for debounced behavior when the component is unmounted
            const aside = this?.$el?.querySelector('aside')
            const asideHeight = aside ? aside.offsetHeight : 0
            const anchorOffset = asideHeight + 20
            this.anchorOffset = anchorOffset
        }, 100),
        onSummaryRendered() {
            this.computeAnchorOffset()
        },

        checkIfSummaryIsSticked: throttle(function () {
            const summary = this.$el.querySelector('aside')
            this.isSummarySticked =
                summary?.getBoundingClientRect().top <= 50 /* $navbar-height */ &&
                window?.innerWidth > 768 /* $min-tablet */
        }, 16),
    },

    computed: {
        description() {
            return this.projectsStore.project.description
        },

        updatedProject() {
            return this.projectsStore.project
        },

        showDescriptionPlaceHolder() {
            return this.project.description.length === 0 || this.project.description === '<p></p>'
        },
        showEditButton() {
            return this.canEditProject && !this.showDescriptionPlaceHolder
        },
    },

    watch: {
        showEditButton: {
            handler: function (neo, old) {
                if (neo != old) {
                    // give time to render content
                    this.$nextTick(() => {
                        this.computeAnchorOffset()
                    })
                }
            },
            immediate: true,
        },
    },
}
</script>

<style lang="scss" scoped>
.project-description {
    padding: $space-l 0;

    @media screen and (min-width: $min-tablet) {
        padding: $space-xl 0;
    }

    .description-content {
        background: $white;
        padding: $space-l 0;
        padding-top: 0;
        overflow-wrap: break-word;
        color: $almost-black;
        flex-grow: 1;
        overflow: auto;
    }

    .summary {
        max-width: 100%;
        min-width: 300px;
    }

    aside {
        padding-top: $space-l;
        position: static;
        display: flex;
        flex-flow: column;
        justify-content: flex-start;
        align-items: center;
        gap: 1rem;
        background-color: rgb(255 255 255 / 70%);

        @media screen and (min-width: $min-tablet) {
            flex-flow: row;
            justify-content: flex-end;
            align-items: center;
            position: sticky;
            z-index: 100;
            top: $navbar-height;
        }
    }

    .project-title-recall {
        flex-grow: 1;
        text-align: left;
        text-overflow: ellipsis;
        white-space: nowrap;
        overflow: hidden;
        font-size: $font-size-2xl;
    }
}

:deep(.description-content > p),
:deep(.description-content > h1),
:deep(.description-content > h2),
:deep(.description-content > h3),
:deep(.description-content > h4),
:deep(.description-content > h5),
:deep(.description-content > h6),
:deep(.description-content > ul),
:deep(.description-content > ol),
:deep(.description-content > blockquote),
:deep(.description-content > pre),
:deep(.description-content > .custom-video-ctn) {
    max-width: pxToRem(800px);
    margin-left: auto;
    margin-right: auto;
}

:deep(.anchor-element) {
    display: inline-block;
}

.edit-description-button {
    display: inline-block;
    padding: $space-s;
    border-radius: 100%;
    background-color: $primary-dark;
    cursor: pointer;

    .icon {
        width: $layout-size-xl;
        fill: $white;
    }

    &:hover {
        .icon {
            animation: rotate-pen 0.5s ease-in-out infinite;
            transform-origin: bottom left;
        }
    }
}

@keyframes rotate-pen {
    0% {
        transform: rotate(0deg);
    }

    25% {
        transform: rotate(10deg);
    }

    75% {
        transform: rotate(-10deg);
    }

    100% {
        transform: rotate(0deg);
    }
}
</style>
