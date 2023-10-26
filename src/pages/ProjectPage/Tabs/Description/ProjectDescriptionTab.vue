<template>
    <div>
        <div v-if="project" class="project-description">
            <aside>
                <div v-if="canEditProject && !showDescriptionPlaceHolder" class="description-edit">
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
        }
    },

    methods: {
        close() {
            this.editDescriptionModalActive = !this.editDescriptionModalActive
        },
        scrollToSection(target) {
            utils.scrollTo(document.getElementById(`anchor-${target}`))
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
    },
}
</script>

<style lang="scss" scoped>
.project-description {
    padding: $space-xl 0;

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
        position: sticky;
        z-index: 100;
        top: $navbar-height;
        display: flex;
        justify-content: flex-end;
        background-color: rgba(255, 255, 255, 0.7);
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

@media screen and (min-width: $min-tablet) {
    .project-description {
        .description-edit,
        .summary {
            margin-left: 3.75rem;
        }
    }
}

@media screen and (max-width: $max-tablet) {
    .project-description {
        flex-direction: column-reverse;
        padding: $space-l $space-s;

        aside {
            padding-left: $space-l;
            position: static;
            margin-left: auto;

            .summary {
                margin-bottom: $space-l;
            }
        }
    }
}
</style>
