<template>
  <div class="project-form">
    <BaseDrawer
      :title="$t('project.edit')"
      :is-opened="isOpened"
      class="full"
      :confirm-action-name="$t('common.save')"
      :confirm-action-disabled="v$.$error"
      :asyncing="isSaving"
      @close="$emit('close')"
      @confirm="submit"
    >
      <!-- TODO: add this validation instead of the invalid variable -->
      <!-- TODO: :confirm-action-disabled="invalid" -->
      <ProjectForm
        v-if="isOpened"
        v-model="form"
        class="edit-project"
        :value="form"
        :is-add-mode="false"
        :validation="v$"
        @close="$emit('close')"
      />
    </BaseDrawer>
  </div>
</template>

<script>
import BaseDrawer from '@/components/base/BaseDrawer.vue'
import ProjectForm from '@/components/project/ProjectForm.vue'
import { postProjectHeader, patchProjectHeader } from '@/api/projects.service'
import useValidate from '@vuelidate/core'
import { helpers, maxLength, minLength, required } from '@vuelidate/validators'
import useToasterStore from '@/stores/useToaster.ts'
import useProjectsStore from '@/stores/useProjects.ts'
export default {
  name: 'ProjectDrawer',

  components: { BaseDrawer, ProjectForm },

  props: {
    isOpened: {
      type: Boolean,
      default: false,
    },
  },

  emits: ['close', 'project-edited'],
  setup() {
    const toaster = useToasterStore()
    const { locale } = useI18n()
    const projectsStore = useProjectsStore()
    return {
      toaster,
      locale,
      projectsStore,
    }
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
        language: this.locale,
        tags: [],
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
          required: helpers.withMessage(this.$t('project.form.title-errors.required'), required),
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
    currentProject() {
      return this.projectsStore.project
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

  mounted() {
    this.fillForm()
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
        this.form.tags = [...this.currentProject.tags]
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
        tags: this.form.tags.map((tag) => tag.id),
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
        await this.projectsStore.updateProject({
          id: this.currentProject.id,
          project: payload,
        })
        this.toaster.pushSuccess(this.$t('toasts.project-edit.success'))
      } catch (error) {
        this.toaster.pushError(`${this.$t('toasts.project-edit.error')} (${error})`)
        console.error(error)
      } finally {
        this.$emit('project-edited')
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
