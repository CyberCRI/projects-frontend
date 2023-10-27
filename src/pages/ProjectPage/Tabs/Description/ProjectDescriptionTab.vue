<template>
    <div>
        <div v-if="project" class="project-description">
            <aside>
                <div v-if="showEditButton" class="description-edit">
                    <LpiButton
                        :label="$filters.capitalize($t('description.edit-title'))"
                        :secondary="true"
                        class="edit-description-button white-bg"
                        left-icon="Pen"
                        @click="editDescriptionModalActive = !editDescriptionModalActive"
                        data-test="edit-description"
                    />
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

            <div v-else class="description-content" v-html="description" />
        </div>

        <DescriptionDrawer
            v-if="editDescriptionModalActive"
            :is-opened="editDescriptionModalActive"
            :project="updatedProject"
            @close="close"
        />
    </div>
</template>

<script>
import DescriptionSummaryBlock from '@/components/lpikit/Summary/DescriptionSummaryBlock.vue'
import LpiButton from '@/components/lpikit/LpiButton/LpiButton.vue'
import DescriptionDrawer from '@/components/lpikit/EditDescriptionDrawer/DescriptionDrawer.vue'
import permissions from '@/mixins/permissions.ts'
import ProjectTab from '@/mixins/ProjectTab.ts'
import DescriptionPlaceholder from './DescriptionPlaceholder.vue'
import utils from '@/functs/functions.ts'
import fixEditorContent from '@/functs/editorUtils.ts'
import debounce from 'lodash.debounce'
export default {
    name: 'ProjectDescriptionTab',

    components: {
        DescriptionDrawer,
        LpiButton,
        DescriptionSummaryBlock,
        DescriptionPlaceholder,
    },

    mixins: [permissions, ProjectTab],

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
        }
    },

    mounted() {
        this.computeAnchorOffset()
        window.addEventListener('resize', this.computeAnchorOffset)
    },

    beforeUnmount() {
        window.removeEventListener('resize', this.computeAnchorOffset)
    },

    methods: {
        close() {
            this.editDescriptionModalActive = !this.editDescriptionModalActive
        },
        scrollToSection(target) {
            utils.scrollTo(document.getElementById(`anchor-${target}`))
        },
        computeAnchorOffset: debounce(
            function () {
                const aside = this?.$el?.querySelector('aside')
                const asideHeight = aside ? aside.offsetHeight : 0
                const anchorOffset = asideHeight + 20
                this.anchorOffset = anchorOffset
            },
            100,
            { leading: false, trailing: true }
        ),
        onSummaryRendered() {
            this.computeAnchorOffset()
        },
    },

    computed: {
        description() {
            return this.$store.getters['projects/project'].description
        },

        updatedProject() {
            return this.$store.getters['projects/project']
        },

        showDescriptionPlaceHolder() {
            return this.project.description.length === 0 || this.project.description === '<p></p>'
        },
        showEditButton() {
            return this.canEditProject && !this.showDescriptionPlaceHolder
        },
    },

    watch: {
        description: {
            handler: function (neo, old) {
                if (neo != old) {
                    // give time to render content
                    this.$nextTick(() => {
                        const contentNode = this.$el.querySelector('.description-content')
                        fixEditorContent(contentNode)
                    })
                }
            },
            immediate: true,
        },

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
        word-break: break-word;
        color: $gray-3;
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
            align-items: flex-start;
            position: sticky;
            z-index: 100;
            top: $navbar-height;
        }
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
:deep(.description-content > .custom-video-ctn) {
    max-width: pxToRem(800px);
    margin-left: auto;
    margin-right: auto;
}

:deep(.anchor-element) {
    display: inline-block;
}

// @media screen and (min-width: $min-tablet) {
//     .project-description {
//         .description-edit,
//         .summary {
//             margin-left: 3.75rem;
//         }
//     }
// }

// @media screen and (max-width: $max-tablet) {
//     .project-description {
//         aside {
//             padding-left: $space-l;
//             margin-left: auto;

//             .summary {
//                 margin-bottom: $space-l;
//             }
//         }
//     }
// }
</style>
