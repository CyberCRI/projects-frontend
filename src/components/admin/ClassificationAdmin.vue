<template>
  <div class="block-container">
    <h2 class="title">
      {{ $t('admin.classifications.title') }}
    </h2>
    <p class="notice">
      {{ $t('admin.classifications.subtitle') }}
    </p>

    <div v-if="isLoadingOrgClassifications" class="loader">
      <LoaderSimple />
    </div>

    <div v-else>
      <div>
        <LpiButton
          :label="$t('common.add')"
          btn-icon="Plus"
          @click="createClassificationIsOpen = true"
        />
      </div>
      <p v-if="!orgClassifications.length">
        {{ $t('admin.classifications.no-custom') }}
      </p>
      <table v-else class="table">
        <thead>
          <tr>
            <th>{{ $t('admin.classifications.title-field') }}</th>
            <th>{{ $t('admin.classifications.description-field') }}</th>
            <th>{{ $t(`admin.classifications.enabled-for-${type}`) }}</th>
            <th />
          </tr>
        </thead>
        <tbody>
          <tr v-for="classification in orgClassifications" :key="classification.id">
            <td>
              <strong>{{ classification.title }}</strong>
            </td>
            <td class="classification-description">
              <ClassificationDescription :classification="classification" />
            </td>
            <td>
              <LpiCheckbox
                v-if="type === 'skills'"
                data-test="classification-switch-for-skills"
                class="as-button min-width"
                :model-value="classification.is_enabled_for_skills"
                :label="
                  classification.is_enabled_for_skills
                    ? $t('common.activated')
                    : $t('common.activate')
                "
                @update:model-value="set_enabled_for_skills(classification, $event)"
              />

              <LpiCheckbox
                v-if="type === 'projects'"
                data-test="classification-switch-for-projects"
                class="as-button min-width"
                :model-value="classification.is_enabled_for_projects"
                :label="
                  classification.is_enabled_for_projects
                    ? $t('common.activated')
                    : $t('common.activate')
                "
                @update:model-value="set_enabled_for_projects(classification, $event)"
              />
            </td>
            <td>
              <div class="actions">
                <ContextActionButton
                  data-test="edit-classification-button"
                  secondary
                  no-border
                  action-icon="Pen"
                  :disabled="!isCustomClassification(classification)"
                  @click="classificationToEdit = classification"
                />
                <ContextActionButton
                  data-test="delete-classification-button"
                  secondary
                  no-border
                  action-icon="TrashCanOutline"
                  :disabled="!isCustomClassification(classification)"
                  @click="classificationToDelete = classification"
                />
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <ConfirmModal
      v-if="classificationToDelete"
      data-test="confirm-delete-classification-modal"
      :asyncing="isDeletingClassification"
      :title="$t('admin.classifications.delete-classification.title')"
      :content="
        $t('admin.classifications.delete-classification.content', {
          title: classificationToDelete?.title,
        })
      "
      @cancel="classificationToDelete = null"
      @confirm="deleteClassification"
    />
  </div>
  <EditClassification
    data-test="edit-classification-drawer"
    :classification="classificationToEdit"
    :is-open="!!(classificationToEdit || createClassificationIsOpen)"
    @close="closeEditClassification"
    @classification-edited="onClassificationEdited"
    @classification-created="onClassificationCreated"
  />
</template>
<script>
import LpiButton from '@/components/base/button/LpiButton.vue'
import useTagSearch from '@/composables/useTagSearch.js'
import EditClassification from '@/components/admin/EditClassification.vue'
import LoaderSimple from '@/components/base/loader/LoaderSimple.vue'
import LpiCheckbox from '@/components/base/form/LpiCheckbox.vue'
import ContextActionButton from '@/components/base/button/ContextActionButton.vue'
import { deleteOrgClassification } from '@/api/tag-classification.service'
import ConfirmModal from '@/components/base/modal/ConfirmModal.vue'
import useOrganizationsStore from '@/stores/useOrganizations.ts'
import useToasterStore from '@/stores/useToaster.ts'
import ClassificationDescription from '@/components/admin/ClassificationDescription.vue'
import { isCustomClassification } from '@/functs/ClassificationUtils.ts'
export default {
  name: 'ClassificationAdmin',

  components: {
    LpiButton,
    EditClassification,
    LoaderSimple,
    LpiCheckbox,
    ContextActionButton,
    ConfirmModal,
    ClassificationDescription,
  },

  props: {
    type: {
      type: String, // "skills" or "projects"
      required: true,
    },
  },

  setup() {
    const organizationsStore = useOrganizationsStore()
    const toaster = useToasterStore()
    const {
      orgClassifications,
      orgClassificationOptions,
      allOrgClassifications,
      isLoadingOrgClassifications,
      fetchAllClassifications,
    } = useTagSearch({
      hideOrganizationTags: true,
    })
    return {
      organizationsStore,
      toaster,
      orgClassifications,
      orgClassificationOptions,
      allOrgClassifications,
      isLoadingOrgClassifications,
      fetchAllClassifications,
    }
  },

  data() {
    return {
      confirmModalVisible: false,
      createClassificationIsOpen: false,
      classificationToDelete: null,
      classificationToEdit: null,
      isDeletingClassification: false,
    }
  },

  methods: {
    isCustomClassification(classification) {
      return isCustomClassification(classification)
    },
    async set_enabled_for_projects(classification, value) {
      try {
        // set enabled for projects
        // we remove it anyway and (re-)add it if needed
        const org_enabled_for_projects =
          this.organizationsStore.current.enabled_projects_tag_classifications
            .map((c) => c.id)
            .filter((id) => id != classification.id)
        if (value) org_enabled_for_projects.push(classification.id)
        await this.organizationsStore.updateCurrentOrganization({
          enabled_projects_tag_classifications: org_enabled_for_projects,
        })
        await this.fetchAllClassifications(true)

        this.toaster.pushSuccess(
          value
            ? this.$t('admin.classifications.enabled-for-projects-success')
            : this.$t('admin.classifications.disabled-for-projects-success')
        )
      } catch (err) {
        this.toaster.pushError(this.$t('admin.classifications.edit-classification.error'))
        console.log(err)
      }
    },

    async set_enabled_for_skills(classification, value) {
      try {
        // set enabled for skills
        // we remove it anyway and (re-)add it if needed
        const org_enabled_for_skills =
          this.organizationsStore.current.enabled_skills_tag_classifications
            .map((c) => c.id)
            .filter((id) => id != classification.id)
        if (value) org_enabled_for_skills.push(classification.id)
        await this.organizationsStore.updateCurrentOrganization({
          enabled_skills_tag_classifications: org_enabled_for_skills,
        })
        await this.fetchAllClassifications(true)
        this.toaster.pushSuccess(
          value
            ? this.$t('admin.classifications.enabled-for-skills-success')
            : this.$t('admin.classifications.disabled-for-skills-success')
        )
      } catch (err) {
        this.toaster.pushError(this.$t('admin.classifications.edit-classification.error'))
        console.log(err)
      }
    },
    closeEditClassification() {
      this.classificationToEdit = null
      this.createClassificationIsOpen = false
    },
    async onClassificationEdited() {
      this.closeEditClassification()
      await this.reloadClassification(true)
    },
    async onClassificationCreated() {
      this.closeEditClassification()
      await this.reloadClassification(true)
    },
    async onClassificationDeleted() {
      await this.reloadClassification()
      this.classificationToDelete = null
    },

    async reloadClassification() {
      await Promise.all([
        this.organizationsStore.getCurrentOrganization(this.organizationsStore.current.code),
        this.fetchAllClassifications(),
      ])
    },

    async deleteClassification() {
      if (!this.classificationToDelete) return
      this.isDeletingClassification = true
      try {
        await deleteOrgClassification(
          this.organizationsStore.current.code,
          this.classificationToDelete.id
        )
        this.toaster.pushSuccess(this.$t('admin.classifications.delete-classification.success'))
        this.onClassificationDeleted()
      } catch (err) {
        this.toaster.pushError(this.$t('admin.classifications.delete-classification.error'))
        console.log(err)
      } finally {
        this.isDeletingClassification = false
        this.classificationToDelete = null
      }
    },
  },
}
</script>

<style lang="scss" scoped>
strong {
  font-weight: bold;
}

.select-and-create {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1rem;
  margin-block: $space-l;
}

.title {
  text-transform: uppercase;
  font-weight: bold;
  color: $primary-dark;
  margin-bottom: $space-xl;
  font-size: $font-size-l;
}

.notice {
  margin-bottom: $space-l;
  font-size: $font-size-s;
}

.table {
  width: 100%;
  border-collapse: collapse;
  table-layout: fixed;

  thead,
  tbody tr {
    border-bottom: $border-width-s solid $mid-gray;
  }

  th {
    font-weight: 700;
    text-align: left;
  }

  td,
  th {
    padding: $space-m;
  }

  td.loader-td {
    padding: 0;
  }

  .actions {
    display: flex;
    gap: $space-s;
  }
}
</style>
