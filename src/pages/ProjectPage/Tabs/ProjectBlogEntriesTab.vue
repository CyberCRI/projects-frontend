<template>
    <div class="project-blog-entries">
        <div class="blog-entries-ctn">
            <BlogEntry
                v-for="(blogEntry, i) in blogEntries"
                :id="`entry-${blogEntry.id}`"
                :key="blogEntry.id"
                :blog-entry="blogEntry"
                :can-delete="canEditProject"
                :can-edit="canEditProject"
                :is-expanded="expandedEntry === blogEntry.id"
                :is-last-blog-entry="i === 0"
                @toggle-expand="updateExpanded(blogEntry.id)"
                @edit-clicked="projectLayoutToggleAddModal('blogEntry', blogEntry)"
                @delete-clicked="openConfirmModal(blogEntry)"
            />
        </div>

        <aside v-if="summaryItems.length || canEditProject">
            <div v-if="canEditProject" class="add-blog">
                <LpiButton
                    :label="$filters.capitalize($t('blog.add-entry'))"
                    class="add-blog-btn"
                    @click="projectLayoutToggleAddModal('blogEntry')"
                />
            </div>
            <BlogSummaryBlock
                :current="expandedEntry"
                :items="summaryItems"
                @item-clicked="updateExpanded"
            />
        </aside>

        <ConfirmModal
            v-if="confirmModalVisible"
            :content="$t('project.blog-confirm-delete')"
            :title="$t('common.delete')"
            @cancel="confirmModalVisible = false"
            @confirm="deleteBlogEntry"
            :asyncing="asyncing"
        />
    </div>
</template>

<script>
import BlogEntry from '@/components/project/blog/BlogEntry.vue'
import BlogSummaryBlock from '@/components/project/blog/BlogSummaryBlock.vue'
import ConfirmModal from '@/components/base/modal/ConfirmModal.vue'
import permissions from '@/mixins/permissions.ts'
import ProjectTab from '@/mixins/ProjectTab.ts'
import LpiButton from '@/components/base/button/LpiButton.vue'

export default {
    name: 'ProjectBlogEntriesTab',

    mixins: [permissions, ProjectTab],

    inject: ['projectLayoutToggleAddModal'],

    components: {
        BlogEntry,
        BlogSummaryBlock,
        ConfirmModal,
        LpiButton,
    },

    data() {
        return {
            expandedEntry: null,
            confirmModalVisible: false,
            currentBlogEntry: null,
            sockerserver: import.meta.env.VITE_APP_WSS_HOST,
            provider: null,
            asyncing: false,
        }
    },

    computed: {
        blogEntries() {
            return this.$store.getters['projects/project'].blog_entries
        },

        blogEntriesLength() {
            return this.blogEntries.length
        },

        project() {
            return this.$store.getters['projects/project']
        },

        summaryItems() {
            return this.$store.getters['projects/project'].blog_entries.map((blogEntry) => {
                return {
                    id: blogEntry.id,
                    label: blogEntry.title,
                    date: blogEntry.created_at,
                }
            })
        },
    },

    methods: {
        updateExpanded(id) {
            const targetEntry = this.blogEntries.find((entry) => entry.id === id)
            if (targetEntry && this.expandedEntry === targetEntry.id) this.expandedEntry = null
            else {
                this.expandedEntry = id
                document.getElementById(`entry-${id}`).scrollIntoView({
                    behavior: 'smooth',
                    block: 'center',
                })
            }
        },

        openConfirmModal(blogEntry) {
            this.confirmModalVisible = true
            this.currentBlogEntry = blogEntry
        },

        async deleteBlogEntry() {
            this.asyncing = true
            await this.$store.dispatch('blogEntries/deleteBlogEntry', this.currentBlogEntry)
            this.asyncing = false
            this.confirmModalVisible = false
        },
    },

    watch: {
        blogEntriesLength: {
            handler: function () {
                // Router needs to be tested, if it's not set right away it might create an error
                if (this.$router && this.blogEntriesLength === 0)
                    this.$router.push({
                        name: 'projectSummary',
                        params: { slugOrId: this.project.slug },
                    })
                if (!this.expandedEntry) {
                    this.expandedEntry =
                        (this.blogEntries.length &&
                            this.blogEntries[0] &&
                            this.blogEntries[0].id) ||
                        null
                }
            },
            immediate: true,
        },
        expandedEntry(neo, old) {
            if (neo && neo != old) {
                this.$nextTick(() => {
                    const target = document.getElementById(`entry-${neo}`)

                    let offset = 20
                    const header = document.querySelector('.header__container')
                    if (header) {
                        offset += header.getBoundingClientRect().height
                    }

                    if (target) {
                        const bbox = target.getBoundingClientRect()
                        const top = bbox.top
                        window.scroll({
                            left: 0,
                            top: window.scrollY + top - offset,
                            behavior: 'smooth',
                        })
                    }
                })
            }
        },
    },
}
</script>

<style lang="scss" scoped>
.project-blog-entries {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    padding: $space-2xl 0;
    position: relative;

    .blog-entries-ctn {
        width: calc(100% - 400px);

        > div:not(:first-of-type) {
            margin-top: $space-l;
        }
    }

    aside {
        position: sticky;
        top: $navbar-height;
        min-width: 320px;
        max-width: 100%;
    }
}

.add-blog {
    display: flex;
    justify-content: flex-end;
    padding-bottom: $space-l;
}

@media screen and (max-width: $max-tablet) {
    .project-blog-entries {
        flex-direction: column-reverse;
        padding: $space-2xl $space-s;

        aside {
            position: static;
            margin-bottom: $space-l;
            margin-left: auto;
        }

        .blog-entries-ctn {
            width: 100%;
        }
    }
}
</style>
