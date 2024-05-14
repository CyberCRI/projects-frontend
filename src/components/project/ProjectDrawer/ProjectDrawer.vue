<template>
    <div class="project-form">
        <BaseDrawer
            @close="$emit('close')"
            @confirm="submit"
            :title="$t('project.edit')"
            :is-opened="isOpened"
            class="full"
            :confirm-action-name="$t('project.form.edit-project')"
            :confirm-action-disabled="v$.$error"
            :asyncing="isSaving"
        >
            <!-- TODO: add this validation instead of the invalid variable -->
            <!-- TODO: :confirm-action-disabled="invalid" -->
            <ProjectForm
                class="edit-project"
                v-if="isOpened"
                v-model="form"
                :value="form"
                :is-add-mode="false"
                @close="$emit('close')"
                :validation="v$"
            />
        </BaseDrawer>
    </div>
</template>

<script>
import BaseDrawer from '@/components/base/BaseDrawer.vue'
import ProjectForm from '@/components/project/ProjectForm/ProjectForm.vue'
import { postProjectHeader, patchProjectHeader } from '@/api/projects.service'
import useValidate from '@vuelidate/core'
import { helpers, maxLength, minLength, required } from '@vuelidate/validators'

export default {
    name: 'ProjectDrawer',

    components: { BaseDrawer, ProjectForm },

    emits: ['close'],

    props: {
        isOpened: {
            type: Boolean,
            default: false,
        },
    },

    data() {
        return {
            v$: useValidate(),

            form: {
                title: '',
                purpose: '',
                category: undefined,
                categories: [''],
                header_image: {
                    variations: {
                        small: undefined,
                    },
                },
                language: this.$store.state.languages.current,
                wikipedia_tags: [],
                organization_tags: [],
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

    mounted() {
        this.fillForm()
    },

    computed: {
        currentProject() {
            return this.$store.getters['projects/project']
        },
    },

    watch: {
        isOpened: {
            handler: function () {
                this.fillForm()
            },
            immediate: true,
        },
    },

    methods: {
        async submit() {
            this.isFormCorrect = await this.v$.$validate()

            if (this.isFormCorrect) {
                this.isSaving = true
                await this.editProject()
                this.$emit('close')
            }
        },

        async fillForm() {
            if (this.currentProject) {
                this.form.title = this.currentProject.title
                this.form.purpose = this.currentProject.purpose
                this.form.categories = [...this.currentProject.categories]
                this.form.language = this.currentProject.language
                this.form.header_image = this.currentProject.header_image
                this.form.wikipedia_tags = [...this.currentProject.wikipedia_tags]
                this.form.organization_tags = [...this.currentProject.organization_tags]
                this.form.imageSizes = null
                if (
                    this.currentProject &&
                    this.currentProject.header_image &&
                    this.currentProject.header_image.scale_x &&
                    this.currentProject.header_image.scale_y &&
                    this.currentProject.header_image.natural_ratio
                ) {
                    this.form.imageSizes = {
                        scaleX: this.currentProject.header_image.scale_x,
                        scaleY: this.currentProject.header_image.scale_y,
                        naturalRatio: this.currentProject.header_image.natural_ratio,
                        left: this.currentProject.header_image.left || 0,
                        top: this.currentProject.header_image.top || 0,
                    }
                }
                if (this.v$ && this.v$.$validate) this.isFormCorrect = await this.v$.$validate()
            }
        },

        async editProject() {
            const payload = {
                ...this.form,
                header_image: this.form.header_image,
                wikipedia_tags_ids: this.form.wikipedia_tags.map((tag) => tag.wikipedia_qid),
                organization_tags_ids: this.form.organization_tags.map((tag) => tag.id),
            }

            const formData = new FormData()
            const imageSizes = payload['imageSizes']
            formData.append('scale_x', imageSizes ? imageSizes.scaleX : '')
            formData.append('scale_y', imageSizes ? imageSizes.scaleY : '')
            formData.append('left', imageSizes ? imageSizes.left : '')
            formData.append('top', imageSizes ? imageSizes.top : '')
            formData.append('natural_ratio', imageSizes ? imageSizes.naturalRatio : '')

            if (payload.header_image instanceof File) {
                formData.append('file', payload['header_image'], payload['header_image'].name)
                payload.header_image_id = (
                    await postProjectHeader({
                        project_id: this.currentProject.id,
                        body: formData,
                    })
                ).id

                // TODO: make this in POST when backend allows it
                formData.delete('file')
                await patchProjectHeader({
                    project_id: this.currentProject.id,
                    image_id: payload.header_image_id,
                    body: formData,
                })
            } else if (this.currentProject.header_image.id) {
                await patchProjectHeader({
                    project_id: this.currentProject.id,
                    image_id: this.currentProject.header_image.id,
                    body: formData,
                })
            }
            delete payload.header_image
            delete payload.imageSizes

            try {
                await this.$store.dispatch('projects/updateProject', {
                    id: this.currentProject.id,
                    project: payload,
                })
                this.$store.dispatch('notifications/pushToast', {
                    message: this.$t('toasts.project-edit.success'),
                    type: 'success',
                })
            } catch (error) {
                this.$store.dispatch('notifications/pushToast', {
                    message: `${this.$t('toasts.project-edit.error')} (${error})`,
                    type: 'error',
                })
                console.error(error)
            } finally {
                this.isSaving = false
            }
        },
    },
}
</script>
<style lang="scss" scoped>
.edit-project {
    width: 100%;
    max-width: pxToRem(532px);
    margin: $navbar-height auto 0 auto;
}
</style>
