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
                    :left-icon="isSaving ? 'LoaderSimple' : null"
                    class="submit-btn"
                    @click="submit"
                    data-test="project-create-button"
                />
            </div>
        </div>
    </div>
</template>

<script>
import ProjectForm from '@/components/lpikit/ProjectForm/ProjectForm.vue'
import LpiButton from '@/components/lpikit/LpiButton/LpiButton.vue'
import LpiSnackbar from '@/components/lpikit/Snackbar/LpiSnackbar.vue'
import permissions from '@/mixins/permissions.ts'

import useValidate from '@vuelidate/core'
import { required, minLength, maxLength, helpers } from '@vuelidate/validators'

export default {
    name: 'CreateProjectLayout',

    mixins: [permissions],

    emits: ['close'],

    components: { ProjectForm, LpiButton, LpiSnackbar },

    data() {
        return {
            v$: useValidate(),
            isFormCorrect: true,

            form: {
                title: '',
                purpose: '',
                category: undefined,
                header_image: {
                    variations: {
                        small: undefined,
                    },
                },

                language: this.$store.state.languages.current,

                wikipedia_tags: [],
                organization_tags: [],

                team: {
                    owners: null,
                    members: null,
                    reviewers: null,
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
        formNotEmpty() {
            if (this.$store.getters['organizations/isDefault']) {
                return !!this.form.title && !!this.form.purpose
            }
            return !!this.form.title && !!this.form.category && !!this.form.purpose
        },
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
                organizations_codes: [this.$store.getters['organizations/current'].code],
                wikipedia_tags_ids: this.form.wikipedia_tags.map((tag) => tag.wikipedia_qid),
                organization_tags_ids: this.form.organization_tags.map((tag) => tag.id),
            }

            if (this.form.category) {
                payload['project_categories_ids'] = [this.form.category.toString()]
            }
            this.isSaving = true
            try {
                const project = await this.$store.dispatch('projects/addProject', payload)

                /* Until backend allows adding tags in the addProject request, add them after project creation */
                if (this.form.wikipedia_tags.length || this.form.organization_tags.length) {
                    await this.$store.dispatch('projects/updateProject', {
                        id: project.id,
                        project: {
                            wikipedia_tags_ids: this.form.wikipedia_tags.map(
                                (tag) => tag.wikipedia_qid
                            ),
                            organization_tags_ids: this.form.organization_tags.map((tag) => tag.id),
                        },
                        scope: 'updated.basics',
                    })
                }
                this.$router.push(`/projects/${project.slug}/description`)
                this.$store.dispatch('notifications/pushToast', {
                    message: this.$t('toasts.project-create.success'),
                    type: 'success',
                })
            } catch (error) {
                this.$store.dispatch('notifications/pushToast', {
                    message: `${this.$t('toasts.project-create.error')} (${error})`,
                    type: 'error',
                })
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
        line-height: 1.6;
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
