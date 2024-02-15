<template>
    <div class="project-settings">
        <h2 class="title">{{ $filters.capitalize($t('project.settings')) }}</h2>

        <div class="main">
            <div v-if="this.canEditProject" class="left">
                <div class="section">
                    <h3 class="label">{{ $t('project.visibility') }}</h3>

                    <GroupButton
                        v-model="publicationStatus"
                        :has-icon="true"
                        :is-vertical="isMobile"
                        :options="visibilityOptions"
                        class="setting"
                    />

                    <div class="tips-list">
                        <ul>
                            <li class="item">
                                <span class="sub-title">{{ $t('visibility.private-title') }}</span>
                                {{ $t('visibility.private') }}
                            </li>
                            <li class="item">
                                <span class="sub-title">{{ $t('visibility.public-title') }}</span>
                                {{ $t('visibility.public') }}
                            </li>
                            <li class="item">
                                <span class="sub-title">{{
                                    $t('visibility.community-title')
                                }}</span>
                                {{ $t('visibility.community') }}
                            </li>
                        </ul>
                    </div>
                    <h3 class="label">{{ $t('project.life-status') }}</h3>
                    <GroupButton
                        v-model="lifeStatus"
                        :has-icon="true"
                        :is-vertical="isMobile"
                        :options="lifeStatusOptions"
                    />
                </div>

                <div v-if="canAddReview && isReviewable" class="section">
                    <h3 class="label">{{ $t('project.reviews') }}</h3>
                    <div>
                        <LpiButton
                            :label="$filters.capitalize($t('project.review'))"
                            :secondary="true"
                            @click="toggleReviewDrawer"
                        />
                    </div>
                </div>
                <div class="section">
                    <h3 class="label">{{ $t('project.org-settings.title') }}</h3>

                    <p class="org-description">
                        {{ $t('project.org-settings.description') }}
                    </p>

                    <div v-if="organizations.length" class="organization-ctn">
                        <div v-if="isLoading" class="loader-block">
                            <LpiLoader type="simple" class="loader" />
                        </div>
                        <div v-for="org in organizations" :key="org.code">
                            <div class="checkbox-item">
                                <LpiCheckbox
                                    v-model="org.selected"
                                    :label="org.name"
                                    :disabled="disableLastOrg(org)"
                                    @input="setOrg(org)"
                                />
                            </div>
                        </div>
                    </div>
                </div>

                <div v-if="categories.length > 0" class="section">
                    <h3 class="label">{{ $t('project.form.project-category') }}</h3>
                    <LpiSnackbar
                        v-if="!currentOrgSelected"
                        class="completed-form-snackbar"
                        icon="QuestionMark"
                        type="error"
                    >
                        <p>{{ $t('project.org-settings.warning') }}</p>
                    </LpiSnackbar>
                    <ul v-if="!currentOrgSelected" class="links-list">
                        <li v-for="link in selectedOrgLinks" :key="link.id">
                            <a :href="link.website_url" class="link" target="_blank">{{
                                link.website_url
                            }}</a>
                        </li>
                    </ul>
                    <template v-else>
                        <div
                            v-if="categories.length > 0 && currentOrgSelected"
                            class="categories-ctn"
                        >
                            <div v-if="isLoading" class="loader-block">
                                <LpiLoader type="simple" class="loader" />
                            </div>
                            <div v-for="category in categories" :key="category.id">
                                <div class="checkbox-item">
                                    <label class="form-control">
                                        <input
                                            v-model="selectedCategory.id"
                                            :value="category.id"
                                            type="radio"
                                            @change="setCategory(category)"
                                        />{{ category.name }}</label
                                    >
                                </div>
                            </div>
                        </div>
                    </template>
                </div>
            </div>

            <div :class="this.canEditProject ? 'right' : 'no-admin'">
                <div class="section section--green">
                    <h3 class="label">{{ $t('project.actions') }}</h3>

                    <LinkButton
                        :label="$filters.capitalize($t('project.duplicate'))"
                        class="button"
                        btn-icon="Copy"
                        @click="duplicateProject"
                    />
                    <div class="separator"></div>
                    <LinkButton
                        :label="$t('report.bug')"
                        class="button"
                        btn-icon="Bug"
                        @click="toggleReportForm('bug')"
                        data-test="report-bug"
                    />
                    <LinkButton
                        :label="$t('report.abuse')"
                        class="button"
                        btn-icon="Flag"
                        @click="toggleReportForm('abuse')"
                        data-test="report-abuse"
                    />

                    <div v-if="canDestroyProject" class="separator"></div>
                    <LinkButton
                        v-if="canDestroyProject"
                        :label="$t('project.destroy')"
                        class="button"
                        btn-icon="TrashCanOutline"
                        @click="toggleConfirmDestroyVisible"
                        data-test="destroy-project"
                    />
                    <div v-if="isMember" class="separator"></div>
                    <LinkButton
                        v-if="isMember"
                        :label="$t('project.quit')"
                        class="button"
                        btn-icon="Logout"
                        @click="openConfirmOrQuit"
                    />
                </div>
            </div>
        </div>

        <ConfirmModal
            v-if="confirmDestroyVisible"
            :content="$t('common.destroy-confirm')"
            :title="$t('project.destroy')"
            @cancel="toggleConfirmDestroyVisible"
            @confirm="destroyProject"
        />

        <ConfirmModal
            v-if="showConfirmQuit"
            :content="$t('common.quit-project')"
            :title="$t('project.quit')"
            :cancel-button-label="'common.cancel'"
            :confirm-button-label="'project.quit'"
            @cancel="toggleShowConfirmQuitVisible"
            @confirm="quitProject"
            :asyncing="asyncing"
        />

        <ConfirmModal
            v-if="showQuitIsImposible"
            :content="$t('common.cant-quit-self')"
            :title="$t('project.quit')"
            :has-second-button="false"
            :cancel-button-label="'common.ok'"
            @cancel="toggleShowQuitIsImposibleVisible"
        />

        <DrawerLayout
            :has-footer="false"
            :is-opened="reportForm.visible"
            :title="reportForm.type ? $t(`report.${reportForm.type}`) : ''"
            class="report-form"
            @close="reportForm.visible = false"
        >
            <ReportForm :type="reportForm.type" @close="toggleReportForm" />
        </DrawerLayout>

        <ReviewDrawer
            :is-opened="reviewDrawerVisible"
            :project="project"
            mode="add"
            @close="toggleReviewDrawer"
        />
    </div>
</template>

<script>
import GroupButton from '@/components/lpikit/GroupButton/GroupButton.vue'
import analytics from '@/analytics'
import permissions from '@/mixins/permissions.ts'
import viewportWidth from '@/mixins/viewportWidth.ts'
import LpiCheckbox from '@/components/lpikit/Checkbox/LpiCheckbox.vue'
import LpiSnackbar from '@/components/lpikit/Snackbar/LpiSnackbar.vue'
import LpiButton from '@/components/lpikit/LpiButton/LpiButton.vue'
import LinkButton from '@/components/lpikit/LpiButton/LinkButton.vue'
import ReportForm from '@/components/lpikit/ReportForm/ReportForm.vue'
import DrawerLayout from '@/components/lpikit/Drawer/DrawerLayout.vue'
import ConfirmModal from '@/components/lpikit/ConfirmModal/ConfirmModal.vue'
import ReviewDrawer from '@/components/lpikit/ReviewDrawer/ReviewDrawer.vue'
import LpiLoader from '@/components/lpikit/Loader/LpiLoader.vue'
import { deleteProjectMembersSelf } from '@/api/project-members.service'

export default {
    name: 'ProjectSettingsTab',

    emits: ['asyncing'],

    mixins: [permissions, viewportWidth],

    components: {
        LpiLoader,
        LpiButton,
        LinkButton,
        LpiCheckbox,
        GroupButton,
        LpiSnackbar,
        ReportForm,
        DrawerLayout,
        ConfirmModal,
        ReviewDrawer,
    },

    props: {
        project: {
            type: Object,
            default: () => {},
        },

        categories: {
            type: Array,
            default: () => [],
        },
    },

    data() {
        return {
            confirmDestroyVisible: false,
            showConfirmQuit: false,
            showQuitIsImposible: false,
            reportForm: {
                visible: false,
                type: undefined,
            },
            reviewDrawerVisible: false,
            selectedCategory: {},
            allOrganizations: [],
            isLoading: false,
            asyncing: false,
        }
    },

    async created() {
        const organizations = await this.$store.dispatch('organizations/getAllOrganizations')
        this.allOrganizations = organizations.results.map((org) => ({
            ...org,
            selected: !!this.project.organizations.find((projOrg) => projOrg.code === org.code),
        }))

        this.selectedCategory =
            this.project.categories.length > 0 ? { ...this.project.categories[0] } : {}
    },

    computed: {
        publicationStatus: {
            get() {
                return this.project.publication_status
            },

            async set(status) {
                try {
                    const response = await this.$store.dispatch('projects/updateProject', {
                        id: this.project.id,
                        project: { publication_status: status },
                    })

                    this.$store.dispatch('projects/updateProjectVisibility', response)

                    this.$store.dispatch('notifications/pushToast', {
                        message: this.$t('toasts.project-visibility-update.success'),
                        type: 'success',
                    })

                    analytics.project.updateVisibility({ id: this.project.id })
                } catch (error) {
                    console.error(error)
                }
            },
        },

        lifeStatus: {
            get() {
                return this.project.life_status
            },

            async set(status) {
                try {
                    await this.$store.dispatch('projects/updateProject', {
                        id: this.project.id,
                        project: { life_status: status },
                    })

                    this.$store.dispatch('notifications/pushToast', {
                        message: this.$t('toasts.project-life-status-update.success'),
                        type: 'success',
                    })

                    analytics.project.updateStatus({ id: this.project.id })
                } catch (error) {
                    console.error(error)
                }
            },
        },

        visibilityOptions() {
            const organizationCodes = this.project.organizations.map((org) => org.code)

            return [
                {
                    value: 'private',
                    label: this.$filters.capitalize(this.$t('status.private')),
                    iconName: 'EyeSlash',
                    condition: true,
                },
                {
                    value: 'public',
                    label: this.$filters.capitalize(this.$t('status.public')),
                    iconName: 'Eye',
                    condition: true,
                },
                {
                    value: 'org',
                    label: this.$filters.capitalize(this.$t('common.org')),
                    iconName: 'PeopleGroup',
                    condition: !organizationCodes.includes('DEFAULT'),
                },
            ].filter((status) => status.condition)
        },

        projectReviewers() {
            return this.project?.team?.reviewers || []
        },

        lifeStatusOptions() {
            return [
                {
                    value: 'running',
                    label: this.$filters.capitalize(this.$t('status.ongoing')),
                    iconName: 'Spinner',
                    condition: true,
                },
                {
                    value: 'toreview',
                    label: this.$filters.capitalize(this.$t('project.reviewable')),
                    iconName: 'ListCheck',
                    condition:
                        this.projectReviewers.length &&
                        (this.isOwner || this.isOrgAdmin || this.isAdmin || this.canAddReview),
                },
                {
                    value: 'completed',
                    label: this.$filters.capitalize(this.$t('status.completed')),
                    iconName: 'Check',
                    condition: true,
                },
            ].filter((status) => status.condition)
        },

        isReviewable() {
            return !!this.project && this.project.life_status === 'toreview'
        },

        organizations() {
            return this.allOrganizations
        },

        selectedOrgLinks() {
            return this.organizations
                .filter((org) => org.selected)
                .map((org) => ({
                    ...org,
                    website_url: `${org.website_url}/projects/${this.project.slug}/project-settings`,
                }))
        },

        organizations_codes() {
            return this.project.organizations.map((org) => org.code)
        },

        currentOrgSelected() {
            return this.organizations_codes.includes(
                this.$store.getters['organizations/current'].code
            )
        },

        isMember() {
            const members = [
                ...this.project.team.members,
                ...this.project.team.owners,
                ...this.project.team.reviewers,
            ]
            return members.find((user) => this.$store.getters['users/kid'] === user.keycloak_id)
        },
    },

    methods: {
        disableLastOrg(org) {
            return this.organizations_codes.length === 1 && this.organizations_codes[0] === org.code
        },
        async setOrg(value) {
            this.isLoading = true

            const payload = !value.selected
                ? [...this.organizations_codes, value.code]
                : this.organizations_codes.filter((orgCode) => orgCode !== value.code)

            try {
                await this.$store.dispatch('projects/updateProject', {
                    id: this.project.id,
                    project: {
                        organizations_codes: payload,
                    },
                })
                this.$store.dispatch('notifications/pushToast', {
                    message: this.$t('toasts.project-organizations-update.success'),
                    type: 'success',
                })
            } catch (error) {
                this.$store.dispatch('notifications/pushToast', {
                    message: `${this.$t('toasts.project-organizations-update.error')} (${error})`,
                    type: 'error',
                })
                console.error(error)
            } finally {
                this.isLoading = false
            }
        },

        async setCategory(value) {
            try {
                await this.$store.dispatch('projects/updateProject', {
                    id: this.project.id,
                    project: {
                        project_categories_ids: [value.id],
                    },
                })
                this.$store.dispatch('notifications/pushToast', {
                    message: this.$t('toasts.project-categories-update.success'),
                    type: 'success',
                })
            } catch (error) {
                this.$store.dispatch('notifications/pushToast', {
                    message: `${this.$t('toasts.project-categories-update.error')} (${error})`,
                    type: 'error',
                })
                console.error(error)
            }
        },

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

                this.$router.push({
                    name: 'projectSummary',
                    params: { slugOrId: project.slug },
                })

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
            }
        },

        toggleConfirmDestroyVisible() {
            this.confirmDestroyVisible = !this.confirmDestroyVisible
        },

        toggleShowConfirmQuitVisible() {
            this.showConfirmQuit = !this.showConfirmQuit
        },
        toggleShowQuitIsImposibleVisible() {
            this.showQuitIsImposible = !this.showQuitIsImposible
        },

        toggleReviewDrawer() {
            this.reviewDrawerVisible = !this.reviewDrawerVisible
        },

        openConfirmOrQuit() {
            if (
                this.project.team.owners &&
                this.project.team.owners.length === 1 &&
                this.project.team.owners.find(
                    (user) => this.$store.getters['users/kid'] === user.keycloak_id
                )
            )
                this.showQuitIsImposible = true
            else this.showConfirmQuit = true
        },
        async destroyProject() {
            try {
                await this.$store.dispatch('projects/deleteProject', this.project.id)
                this.$store.dispatch('notifications/pushToast', {
                    message: this.$t('toasts.project-destroy.success'),
                    type: 'success',
                })
                this.$router.push({ name: 'HomeRoot' })
            } catch (error) {
                this.$store.dispatch('notifications/pushToast', {
                    message: `${this.$t('toasts.project-destroy.error')} (${error})`,
                    type: 'error',
                })
                console.error(error)
            }
        },

        async quitProject() {
            let projectNoMoreVisible = false
            try {
                /* This data is adapted so we can have the origin of the current user */

                this.asyncing = true
                await deleteProjectMembersSelf(this.project.id)
                analytics.project.removeTeamMember({
                    project: {
                        id: this.project.id,
                    },
                })
                if (this.project.publication_status == 'private') {
                    this.$router.push({ name: 'HomeRoot' })
                }
                try {
                    const project = await this.$store.dispatch(
                        'projects/getProject',
                        this.project.id
                    )
                    await this.$store.dispatch('projects/updateCurrentProjectMembers', project)
                } catch {
                    // if the project is not visible anymore, we get a 404
                    projectNoMoreVisible = true
                }

                this.$store.dispatch('notifications/pushToast', {
                    message: this.$t('toasts.project-quit.success'),
                    type: 'success',
                })
            } catch (error) {
                console.error(error)
                /**
                 * we might have a race condition where thre was only two members
                 * and they quit at the same time
                 * so check error and display a "nice" message if this is the case
                 */
                if (error.response?.data?.users) {
                    try {
                        const project = await this.$store.dispatch(
                            'projects/getProject',
                            this.project.id
                        )
                        await this.$store.dispatch('projects/updateCurrentProjectMembers', project)
                    } finally {
                        this.showQuitIsImposible = true
                    }
                } else {
                    /**
                     * here this is just a "standard" error, so display it
                     */
                    this.$store.dispatch('notifications/pushToast', {
                        message: `${this.$t('toasts.project-quit.error')} (${error})`,
                        type: 'error',
                    })
                }
            } finally {
                this.showConfirmQuit = false
                this.asyncing = false
                // if we got a 404, we redirect to dashboard
                if (projectNoMoreVisible) this.$router.push({ name: 'HomeRoot' })
            }
        },

        toggleReportForm(reportType) {
            if (reportType) this.reportForm.type = reportType
            this.reportForm.visible = !this.reportForm.visible
        },
    },
}
</script>

<style lang="scss" scoped>
.project-settings {
    padding: $space-2xl 0;

    .main {
        display: flex;

        .left {
            margin-right: $space-xl;
            width: calc(66.66% - $space-xl);
        }

        .right {
            width: calc(33.34% - $space-xl);
            flex-grow: 1;
        }

        .no-admin {
            width: calc(33.34% - $space-xl);
            flex-grow: unset;
        }

        > div > div:not(:first-of-type) {
            margin-top: $space-xl;
        }
    }

    .section {
        border: $border-width-s solid $green;
        border-radius: $border-radius-l;
        padding: $space-l;

        .separator {
            border-bottom: $border-width-s solid $primary-dark;
            width: pxToRem(50px);
            margin: $space-m 0;
        }

        .button {
            padding-left: unset;
            margin: $space-s 0;
        }

        &--green {
            background: $primary-lighter;
            padding-left: 24px;
        }

        .org-description {
            font-size: $font-size-m;
            line-height: 24px;
            margin-bottom: $space-l;
        }

        .label {
            color: $black;
            margin-bottom: $space-l;
            font-weight: 700;
            font-size: $font-size-2xl;
            line-height: 30px;
        }

        .tips-list {
            display: flex;
            flex-direction: column;
            align-items: flex-start;
            font-size: $font-size-m;
            line-height: 24px;
            margin-bottom: $space-l;

            .item {
                margin-bottom: $space-s;

                .sub-title {
                    font-weight: 700;
                }
            }
        }

        .setting {
            margin-bottom: $space-l;
        }
    }

    .title {
        font-weight: 700;
        font-size: $font-size-3xl;
        line-height: 40px;
        padding-bottom: $space-2xl;
    }

    .links-list {
        margin-top: $space-l;
        list-style-type: disc;

        li {
            margin-left: $space-xl;
        }

        .link {
            font-size: $font-size-m;
            line-height: 20px;
            color: $primary-dark;
        }
    }

    .organization-ctn,
    .categories-ctn {
        position: relative;
        display: flex;
        flex-wrap: wrap;

        /* Loader */
        .loader-block {
            position: absolute;
            width: 100%;
            height: 100%;
            background-color: rgb(255 255 255 / 30%);
            z-index: 1;

            .loader {
                position: absolute;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
            }
        }

        .checkbox-item {
            border: 1px solid $primary-dark;
            padding: $space-m;
            margin: $space-s pxToRem(16px) $space-s 0;
            border-radius: $border-radius-xs;
            display: flex;
            align-items: center;
            text-align: right;

            > label {
                font-weight: 700;
                font-size: $font-size-m;
                line-height: 18px;
                color: $primary-dark;
                margin: 0;
                cursor: pointer;
                margin-left: $space-s;
            }
        }
    }

    .form-control {
        font-size: $font-size-m;
        color: $primary-dark;
        font-weight: 400;
        line-height: 12px;
        display: grid;
        grid-template-columns: 1em auto;
        gap: $space-m;
    }

    .form-control + .form-control {
        margin-top: 1em;
    }

    input[type='radio'] {
        appearance: none;
        background-color: $white;
        margin: 0;
        font: inherit;
        width: pxToRem(20px);
        height: pxToRem(20px);
        border: $border-width-s solid $primary-dark;
        border-radius: 50%;
        transform: translateY(-0.075em);
        display: grid;
        place-content: center;
        cursor: pointer;
    }

    input[type='radio']::before {
        content: '';
        width: pxToRem(12px);
        height: pxToRem(12px);
        transform: scale(0);
        transition: 120ms transform ease-in-out;
        box-shadow: inset 1em 1em $primary-dark;
        border-radius: 50%;
    }

    input[type='radio']:checked::before {
        transform: scale(1);
    }

    input[type='radio']:disabled {
        border: $border-width-s solid $disabled;
        color: $disabled;
        cursor: not-allowed;
    }

    .form-control--disabled {
        color: $disabled;
        cursor: not-allowed;
    }
}

@media screen and (max-width: $max-tablet) {
    .project-settings .main {
        flex-direction: column-reverse;

        .left,
        .right {
            width: 100%;
            margin-bottom: $space-xl;
        }

        .no-admin {
            width: 100%;
        }

        .left {
            margin-right: 0;
            margin-bottom: $space-l;
        }
    }
}

@media screen and (max-width: $min-tablet) {
    .project-settings {
        padding: $space-2xl $space-s;
    }
}
</style>
