<template>
    <div>
        <div v-if="project" class="project-description">
            <DescriptionPlaceholder
                v-if="canEditProject && showDescriptionPlaceHolder"
                :project="project"
            ></DescriptionPlaceholder>

            <div v-else class="description-content" v-html="description" />

            <aside>
                <div v-if="canEditProject && !showDescriptionPlaceHolder" class="description-edit">
                    <LpiButton
                        :label="$filters.capitalize($t('description.edit-title'))"
                        :secondary="true"
                        class="read-description-button"
                        left-icon="Pen"
                        @click="editDescriptionModalActive = !editDescriptionModalActive"
                        data-test="edit-description"
                    />
                </div>
                <SummaryBlock
                    :description="true"
                    class="summary"
                    summary-text-container=".description-content"
                    @item-clicked="scrollToSection"
                />
            </aside>
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
import SummaryBlock from '@/components/lpikit/Summary/SummaryBlock.vue'
import LpiButton from '@/components/lpikit/LpiButton/LpiButton.vue'
import DescriptionDrawer from '@/components/lpikit/EditDescriptionDrawer/DescriptionDrawer.vue'
import permissions from '@/mixins/permissions.ts'
import ProjectTab from '@/mixins/ProjectTab.ts'
import DescriptionPlaceholder from './DescriptionPlaceholder.vue'
import utils from '@/functs/functions.ts'

export default {
    name: 'ProjectDescriptionTab',

    components: {
        DescriptionDrawer,
        LpiButton,
        SummaryBlock,
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
            // dirty fix for tiptap / prosemirror bug
            // (see https://github.com/ueberdosis/tiptap/issues/721 for the open issue on github)
            // that prevent column width from being applied outside the editor
            // the idea is to convert each column width from pixel value to a percentage and aplly it to the cell
            // while keeping a min content width for cells without a width
            handler: function (neo, old) {
                return
                if (neo != old) {
                    this.$nextTick(() => {
                        const tables = this.$el.querySelectorAll('.description-content table')
                        // iterate over each table individually beacause sizing may vary
                        ;[...tables].forEach((table) => {
                            // proceed only if there's some manually sized cell
                            const one_sized_cell = table.querySelector('[colwidth]')

                            if (one_sized_cell) {
                                // fetch a row and calculate total 'manual' width
                                const tr = one_sized_cell.parentNode
                                const tr_cells = tr.children
                                const total_width = [...tr_cells].reduce((acc, cell) => {
                                    const w = cell.getAttribute('colwidth')
                                    if (w) acc += parseInt(w)
                                    return acc
                                }, 0)
                                // safeguard aginst division by zero
                                if (total_width == 0) return

                                // apply width as percentage to each cell
                                const other_cells = table.querySelectorAll('th, td')
                                ;[...other_cells].forEach(function (e) {
                                    const w = parseInt(e.getAttribute('colwidth'))

                                    // if no manual width, use min-content to at least have a column
                                    if (w) {
                                        const percent = (w / total_width) * 100 + '%'
                                        e.style.width = percent
                                    } else e.style.width = 'min-content'
                                })
                            }
                        })
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
    display: flex;
    justify-content: center;
    align-items: flex-start;
    padding: $space-xl 0;

    .description-content {
        background: $white;
        border-radius: $border-radius-l;
        padding: $space-l 0;
        padding-top: 0;
        word-break: break-word;
        color: $gray-3;
        flex-grow: 1;
    }

    .summary {
        max-width: 100%;
        min-width: 300px;
    }

    aside {
        padding-top: $space-l;
        position: sticky;
        top: $navbar-height;
    }
}

.description-edit {
    display: flex;
    align-items: center;
    justify-content: flex-start;
    padding-bottom: $space-l;
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
