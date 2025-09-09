<template>
  <div class="project-form">
    <ClientOnly>
      <FormPanel
        class="project-general-edit-form"
        :confirm-action-name="$t('common.save')"
        :confirm-action-disabled="v$.$error"
        :asyncing="isSaving"
        @close="$emit('close')"
        @confirm="submit"
      >
        <!-- TODO: add this validation instead of the invalid variable -->
        <!-- TODO: :confirm-action-disabled="invalid" -->
        <LazyProjectForm
          v-if="form"
          v-model="form"
          class="edit-project"
          :value="form"
          :validation="v$"
          @close="$emit('close')"
        />
      </FormPanel>
    </ClientOnly>
  </div>
</template>

<script>
import { postProjectHeader, patchProjectHeader } from '@/api/projects.service'
import useValidate from '@vuelidate/core'
import { helpers, maxLength, minLength, required } from '@vuelidate/validators'
import useToasterStore from '@/stores/useToaster.ts'
import useProjectsStore from '@/stores/useProjects.ts'
import { imageSizesFormData } from '@/functs/imageSizesUtils.ts'
export default {
  name: 'ProjectEditGeneralInfos',

  emits: ['close', 'project-edited'],
  setup() {
    const toaster = useToasterStore()
    const projectsStore = useProjectsStore()
    const orgStore = useOrganizations()
    const form = ref({
      title: '',
      purpose: '',
      category: undefined,
      categories: [''],
      header_image: {
        variations: {
          small: undefined,
        },
      },
      language: orgStore.current?.language || 'en',
      tags: [],
    })
    const { startEditWatcher, stopEditWatcher } = useEditWatcher(form)
    return {
      toaster,
      projectsStore,
      form,
      startEditWatcher,
      stopEditWatcher,
    }
  },

  data() {
    return {
      v$: useValidate(),

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

  mounted() {
    this.fillForm()
  },

  methods: {
    async submit() {
      this.isFormCorrect = await this.v$.$validate()

      if (this.isFormCorrect) {
        this.isSaving = true
        await this.editProject()
        this.startEditWatcher()
        this.$emit('close')
      }
    },

    async fillForm() {
      this.stopEditWatcher()

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
      this.startEditWatcher()
    },

    async editProject() {
      const payload = {
        ...this.form,
        header_image: this.form.header_image,
        tags: this.form.tags.map((tag) => tag.id),
      }

      const formData = new FormData()
      const imageSizes = payload['imageSizes']
      imageSizesFormData(formData, imageSizes)

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
