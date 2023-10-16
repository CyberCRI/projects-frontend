<template>
    <div>
        <div class="explanation">
            <h4>{{ $filters.capitalize($t('project.org-change')) }}</h4>

            <p>{{ $t('project.org-hint') }}</p>
        </div>

        <div class="orgs-ctn">
            <CommunityCard
                v-for="org in organizations"
                :key="org.code"
                :community="org"
                :selected="selected.organizations.some((selected) => selected === org.code)"
                @click="toggleCategoryOrOrg('organizations', org.code)"
            />
        </div>

        <div class="explanation">
            <h4>{{ $filters.capitalize($t('project.type-change')) }}</h4>

            <p>{{ $t('project.type-hint') }}</p>
        </div>

        <div class="current-orgs">
            <BadgeItem v-for="org in selected.organizations" :key="org" :label="org" />
        </div>

        <div class="categories-ctn">
            <CategoryCard
                v-for="category in categories"
                :key="category.id"
                :category="category"
                :selected="selected.categories.includes(category.id)"
                @click="toggleCategoryOrOrg('categories', category.id)"
            />
        </div>

        <div class="explanation">
            <h4>{{ $filters.capitalize($t('project.duplicate')) }}</h4>

            <p>{{ $t('project.duplicate-hint') }}</p>
        </div>
        <LpiButton
            :label="$filters.capitalize($t('project.duplicate'))"
            class="actions"
            @click="duplicateProject"
        />

        <div class="explanation">
            <h4>{{ $t('project.quit') }}</h4>

            <p>{{ $t('project.quit-hint') }}</p>
        </div>
        <LpiButton
            :label="$t('project.quit')"
            :disabled="quitButtonDisabled"
            left-icon="Ban"
            class="actions"
            @click="quitProject"
        />
    </div>
</template>

<script>
import CommunityCard from '@/components/lpikit/CommunityCard/CommunityCard.vue'
import CategoryCard from '@/components/lpikit/CategoryCard/CategoryCard.vue'
import BadgeItem from '@/components/lpikit/Badge/BadgeItem.vue'
import LpiButton from '@/components/lpikit/LpiButton/LpiButton.vue'
import permissions from '@/mixins/permissions.ts'

export default {
    name: 'AdvancedOptions',

    emits: ['asyncing', 'close'],

    components: { CommunityCard, CategoryCard, BadgeItem, LpiButton },

    mixins: [permissions],

    created() {
        this.$store.dispatch('organizations/getAllOrganizations')
    },

    data() {
        return {
            selected: {
                categories: this.project.categories.map((category) => category.id),
                organizations: this.project.organizations.map((org) => org.code),
            },
        }
    },

    props: {
        project: {
            type: Object,
            default: () => {},
        },
    },

    computed: {
        allOrganizations() {
            return this.$store.getters['organizations/all']
        },

        categories() {
            return this.$store.getters['projectCategories/allOrderedByOrderId']
        },

        quitButtonDisabled() {
            return (
                this.project.team.members.filter((member) => member.group === 'owners').length ===
                    1 &&
                this.project.team.members.find((member) => member.group === 'owners').user
                    .keycloak_id === this.$store.getters['users/kid']
            )
        },

        organizations() {
            const userOrganizations = this.user.orgs.map((code) => {
                return this.allOrganizations.find((organization) => organization.code === code)
            })
            return this.isAdmin ? this.allOrganizations : userOrganizations
        },

        user() {
            return this.$store.getters['users/user']
        },
    },

    methods: {
        async duplicateProject() {
            try {
                this.$emit('asyncing', true)
                const project = await this.$store.dispatch(
                    'projects/duplicateProject',
                    this.project.id
                )

                await this.$store.dispatch('projects/updateProject', {
                    id: project.id,
                    project: {
                        title: `${this.project.title} ${this.$t('project.copy')}`,
                    },
                })

                this.$router.push(`/projects/${project.slug}/summary`)

                this.$store.dispatch('notifications/pushToast', {
                    message: this.$t('toasts.project-duplication.success'),
                    type: 'success',
                })
            } catch (error) {
                this.$store.dispatch('notifications/pushToast', {
                    message: `${this.$t('toasts.project-duplication.error')} (${error})`,
                    type: 'error',
                })
                console.error(error)
            } finally {
                this.$emit('asyncing', false)
                this.$emit('close')
            }
        },

        async quitProject() {
            try {
                this.$emit('asyncing', true)
                await this.$store.dispatch('projectMembers/deleteProjectMember', {
                    users: [this.$store.getters['users/kid']],
                })

                const project = await this.$store.dispatch('projects/getProject', this.project.id)

                await this.$store.dispatch('projects/updateCurrentProjectMembers', project)

                this.$store.dispatch('notifications/pushToast', {
                    message: this.$t('toasts.project-quit.success'),
                    type: 'success',
                })

                this.$emit('close')
            } catch (error) {
                this.$store.dispatch('notifications/pushToast', {
                    message: `${this.$t('toasts.project-quit.error')} (${error})`,
                    type: 'error',
                })
                console.error(error)
            } finally {
                this.$emit('asyncing', false)
            }
        },

        // submit function is used in ProjectConfig.vue
        // eslint-disable-next-line
        async submit() {
            try {
                this.$emit('asyncing', true)
                // Update organizations if there is a change
                if (
                    this.selected.organizations.sort().join(',') !==
                    this.project.organizations
                        .map((current) => current.code)
                        .sort()
                        .join(',')
                ) {
                    // Abort if no organizations
                    if (!this.selected.organizations.length) {
                        this.selected.organizations = this.project.organizations.map(
                            (org) => org.code
                        )
                        this.$store.dispatch('notifications/pushToast', {
                            message: this.$t('toasts.project-organizations-update.invalid'),
                            type: 'error',
                        })
                        this.$emit('asyncing', false)
                        return
                    }
                    // Else update organizations
                    else {
                        try {
                            await this.$store.dispatch('projects/updateProject', {
                                id: this.project.id,
                                project: {
                                    organizations_codes: this.selected.organizations,
                                },
                            })
                            this.$store.dispatch('notifications/pushToast', {
                                message: this.$t('toasts.project-organizations-update.success'),
                                type: 'success',
                            })
                        } catch (error) {
                            this.$store.dispatch('notifications/pushToast', {
                                message: `${this.$t(
                                    'toasts.project-organizations-update.error'
                                )} (${error})`,
                                type: 'error',
                            })
                            console.error(error)
                        }
                    }
                }
                // Update categories if there is a change
                if (
                    this.selected.categories.sort().join(',') !==
                    this.project.categories
                        .map((current) => current.id)
                        .sort()
                        .join(',')
                ) {
                    try {
                        await this.$store.dispatch('projects/updateProject', {
                            id: this.project.id,
                            project: {
                                project_categories_ids: this.selected.categories,
                            },
                        })
                        this.$store.dispatch('notifications/pushToast', {
                            message: this.$t('toasts.project-categories-update.success'),
                            type: 'success',
                        })
                    } catch (error) {
                        this.$store.dispatch('notifications/pushToast', {
                            message: `${this.$t(
                                'toasts.project-categories-update.error'
                            )} (${error})`,
                            type: 'error',
                        })
                        console.error(error)
                    }
                }
            } finally {
                this.$emit('asyncing', false)
                this.$emit('close')
            }
        },

        toggleCategoryOrOrg(type, idOrCode) {
            const index = this.selected[type].indexOf(idOrCode)

            if (index === -1) this.selected[type].push(idOrCode)
            else this.selected[type].splice(index, 1)
        },
    },
}
</script>

<style lang="scss" scoped>
.explanation {
    h4 {
        font-size: $font-size-l;
        font-weight: 700;
        margin-bottom: $space-m;
    }

    p {
        font-size: $font-size-m;
        font-weight: 400;
    }
}

.orgs-ctn {
    display: grid;
    grid-template-columns: 1fr;
    gap: $space-l;
    margin: $space-xl 0 $space-2xl;
}

.current-orgs {
    margin: $space-l 0;
    text-align: center;

    > .badge:not(:first-child) {
        margin-left: $space-xs;
    }
}

.categories-ctn {
    display: grid;
    grid-template-columns: 1fr;
    gap: $space-l;
    margin-bottom: $space-2xl;
}

.actions {
    margin: $space-l auto;
}

@media screen and (min-width: $min-tablet) {
    .orgs-ctn {
        grid-template-columns: 1fr 1fr;
    }

    .categories-ctn {
        grid-template-columns: 1fr 1fr;
    }
}

@media screen and (min-width: $max-tablet) {
    .orgs-ctn {
        grid-template-columns: 1fr 1fr 1fr;
    }

    .categories-ctn {
        grid-template-columns: 1fr 1fr 1fr;
    }
}
</style>

<style lang="scss">
.advanced-options {
    .orgs-ctn .community-card {
        cursor: pointer;
    }

    .categories-ctn .category-card-ctn {
        cursor: pointer;
    }
}

@media screen and (min-width: $min-tablet) {
    .advanced-options .s-modal-wrapper .s-modal-content {
        max-height: 400px;
    }
}
</style>
