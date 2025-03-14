<template>
    <div class="create-project">
        <div class="header">
            <h1>{{ $t('project.create.title') }}</h1>
            <p>
                {{ $t('project.create.notice') }}
                <RouterLink :to="{ name: 'Help' }" class="help-link"
                    >{{ $t('project.create.help-link') }}
                </RouterLink>
            </p>
        </div>

        <div class="project-form">
            <ProjectForm
                :categories="categories"
                ref="projectForm"
                v-model="form"
                @close="$emit('close')"
                :validation="v$"
            />

            <LpiSnackbar
                v-if="!isFormCorrect"
                class="completed-form-snackbar"
                icon="ExclamationMark"
                type="warning"
            >
                <div v-html="$t('project.form.completed-info-to-access-presentation')"></div>
            </LpiSnackbar>

            <div class="actions">
                <LpiButton
                    :disabled="isSaving"
                    :label="$t('common.cancel')"
                    :secondary="true"
                    class="submit-btn"
                    @click="cancel"
                    data-test="cancel-project-create-button"
                />
                <LpiButton
                    :disabled="!formNotEmpty || isSaving"
                    :label="$t('project.form.create-project')"
                    :btn-icon="isSaving ? 'LoaderSimple' : null"
                    class="submit-btn"
                    @click="submit"
                    data-test="project-create-button"
                />
            </div>
        </div>
    </div>
</template>

<script>
import ProjectForm from '@/components/project/ProjectForm.vue'
import LpiButton from '@/components/base/button/LpiButton.vue'
import LpiSnackbar from '@/components/base/LpiSnackbar.vue'
import permissions from '@/mixins/permissions.ts'

import useValidate from '@vuelidate/core'
import { required, minLength, maxLength, helpers } from '@vuelidate/validators'
import onboardingStatusMixin from '@/mixins/onboardingStatusMixin.ts'
import useToasterStore from '@/stores/useToaster.ts'
import useLanguagesStore from '@/stores/useLanguages'
import useProjectCategories from '@/stores/useProjectCategories.ts'
import useOrganizationsStore from '@/stores/useOrganizations.ts'
import useProjectsStore from '@/stores/useProjects.ts'
import useUsersStore from '@/stores/useUsers.ts'

import analytics from '@/analytics'
import { createProject } from '@/api/projects.service'

export default {
    name: 'CreateProjectPage',

    mixins: [permissions, onboardingStatusMixin],

    emits: ['close'],

    components: { ProjectForm, LpiButton, LpiSnackbar },

    setup() {
        const toaster = useToasterStore()
        const languagesStore = useLanguagesStore()
        const projectCategoriesStore = useProjectCategories()
        const organizationsStore = useOrganizationsStore()
        const projectsStore = useProjectsStore()
        const usersStore = useUsersStore()
        return {
            toaster,
            languagesStore,
            projectCategoriesStore,
            organizationsStore,
            projectsStore,
            usersStore,
        }
    },

    data() {
        return {
            v$: useValidate(),
            isFormCorrect: true,

            form: {
                title: '',
                purpose: '',
                category: undefined,
                header_image: null,

                language: this.languagesStore.current,

                tags: [],

                team: {
                    owners: null,
                    members: null,
                    reviewers: null,
                    people_groups: null,
                },
                imageSizes: null,
            },
            isSaving: false,
        }
    },

    validations() {
        /* Custom 'secret' rule: 3 spaces */
        const rules =
            this.form.purpose === '   '
                ? {
                      minLengthValue: helpers.withMessage(
                          this.$t('project.form.purpose-errors.min'),
                          minLength(3)
                      ),
                      maxLengthValue: helpers.withMessage(
                          this.$t('project.form.purpose-errors.max'),
                          maxLength(180)
                      ),
                  }
                : {
                      required: helpers.withMessage(
                          this.$t('project.form.purpose-errors.required'),
                          required
                      ),
                      minLengthValue: helpers.withMessage(
                          this.$t('project.form.purpose-errors.min'),
                          minLength(3)
                      ),
                      maxLengthValue: helpers.withMessage(
                          this.$t('project.form.purpose-errors.max'),
                          maxLength(180)
                      ),
                  }
        return {
            form: {
                title: {
                    required: helpers.withMessage(
                        this.$t('project.form.title-errors.required'),
                        required
                    ),
                    maxLengthValue: helpers.withMessage(
                        this.$t('project.form.title-errors.max'),
                        maxLength(120)
                    ),
                },
                purpose: rules,
            },
        }
    },

    computed: {
        categories() {
            return this.projectCategoriesStore.allOrderedByOrderId
        },

        formNotEmpty() {
            if (this.organizationsStore.isDefault) {
                return !!this.form.title && !!this.form.purpose
            }
            return (
                !!this.form.title &&
                !!this.form.purpose &&
                (!this.categories?.length || !!this.form.category)
            )
        },
    },

    async mounted() {
        if (!this.categories.length) {
            await this.projectCategoriesStore.getAllProjectCategories()
        }
    },

    methods: {
        cancel() {
            this.$router.push('/')
        },

        async submit() {
            this.isFormCorrect = await this.v$.$validate()

            if (this.isFormCorrect) {
                this.isSaving = true
                this.createProject()
            }
        },

        async createProject() {
            const payload = {
                ...this.form,
                is_locked: false,
                is_shareable: false,
                publication_status: 'private',
                life_status: 'running',
                organizations_codes: [this.organizationsStore.current.code],
                tags: this.form.tags.map((tag) => tag.id),
            }

            if (this.form.category) {
                payload['project_categories_ids'] = [this.form.category.toString()]
            }
            this.isSaving = true
            try {
                const project = await createProject(payload)

                // fetch updated project list from user so permissions as set correctly
                await this.usersStore.getUser(this.usersStore.id)

                analytics.project.create({ id: project.id, title: project.title })

                await this.onboardingTrap('create_project', false)
                // reload current to user to get new permissions
                // maybe set a endpoint to fetch only permission ?
                const user = this.usersStore.userFromApi
                if (user) this.usersStore.getUser(user.id)
                this.$router.push({
                    name: 'projectDescription',
                    params: { slugOrId: project.slug },
                })
                this.toaster.pushSuccess(this.$t('toasts.project-create.success'))
            } catch (error) {
                this.toaster.pushError(`${this.$t('toasts.project-create.error')} (${error})`)
                console.error(error)
            } finally {
                this.loading = false
            }
        },
    },
}
</script>
<style lang="scss" scoped>
.create-project {
    width: 100%;
    max-width: pxToRem(532px);
    margin: $navbar-height auto 0 auto;
    padding: 0 $space-l;
    box-sizing: border-box;
}

.header {
    margin-top: pxToRem(110px);
    margin-bottom: $space-xl;

    h1 {
        font-size: $font-size-5xl;
        font-weight: 700;
        text-align: center;
    }

    p {
        font-size: $font-size-m;
        margin: $space-xl 0;
    }

    .help-link {
        color: $primary-dark;
    }
}

.actions {
    display: flex;
    justify-content: center;
    gap: $space-xl;
    margin-top: $space-m;
    margin-bottom: $space-xl;
}
</style>
