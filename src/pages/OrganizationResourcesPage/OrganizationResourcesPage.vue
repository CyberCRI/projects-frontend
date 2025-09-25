<script setup>
// import analytics from '@/analytics'
import { getOrganizationByCode } from '@/api/organizations.service'
import useOrganizationsStore from '@/stores/useOrganizations'
import { deleteOrganizationFile, getOrganizationFiles } from '@/api/organization-files.service'
import useToasterStore from '@/stores/useToaster'

const { t } = useNuxtI18n()

const fileResources = ref([])

const toaster = useToasterStore()
const { isAdmin } = usePermissions()

const organizationsStore = useOrganizationsStore()

const organization = computed(() => organizationsStore?.current)
const orgCode = computed(() => organization.value?.code)

const confirmModalVisible = ref(false)
const currentResource = ref(null)
const asyncing = ref(false)
const isDrawerOpen = ref(false)
const editedItem = ref(null)

const isEditionEnabled = computed(() => isAdmin.value)

const getFileResources = async () => {
  try {
    asyncing.value = true
    const response = await getOrganizationFiles(orgCode.value)
    fileResources.value = response.results
  } catch (err) {
    console.error(err)
  } finally {
    asyncing.value = false
  }
}

onMounted(getFileResources)

const openModal = (resource) => {
  currentResource.value = resource
  confirmModalVisible.value = true
}

const deleteResource = async (resource) => {
  asyncing.value = true
  try {
    await deleteOrganizationFile(orgCode.value, resource.id)

    // TODO: use org event
    // analytics.attachmentFile.removeAttachment({
    //   project: {
    //     id: this.project.id,
    //   },
    //   attachment: resource,
    // })

    await getFileResources()

    toaster.pushSuccess(t('toasts.file-delete.success'))
  } catch (error) {
    toaster.pushError(`${t('toasts.file-delete.error')} (${error})`)
    console.error(error)
  } finally {
    asyncing.value = false
    confirmModalVisible.value = false
  }
}

const openDrawer = (resource) => {
  editedItem.value = resource
  isDrawerOpen.value = true
}

try {
  const runtimeConfig = useRuntimeConfig()
  const organization = await getOrganizationByCode(runtimeConfig.public.appApiOrgCode)
  const { image, dimensions } = useImageAndDimension(organization?.banner_image, 'medium')
  useLpiHead(
    useRequestURL().toString(),
    t('home.documents'),
    organization?.dashboard_subtitle,
    image,
    dimensions
  )
} catch (err) {
  console.log(err)
}
</script>

<template>
  <div class="page-section-narrow organization-resources-page pssi page-top">
    <h1 class="page-title">
      {{ $t('documents-page.title', { platformName: organization?.name }) }}
    </h1>
    <p class="notice">
      {{ $t('documents-page.description', { platformName: organization?.name }) }}
    </p>
    <div v-if="isEditionEnabled" class="add-resource">
      <LpiButton
        :label="$filters.capitalize($t('resource.add-file'))"
        class="add-item-btn"
        btn-icon="Plus"
        data-test="in-page-add-resources"
        @click="openDrawer()"
      />
    </div>
    <div v-if="asyncing" class="loader">
      <LoaderSimple />
    </div>
    <div v-else-if="!fileResources.length" class="nothing-here">
      <NothingHere />
    </div>
    <div v-else class="resource-ctn">
      <ResourceCard
        v-for="file in fileResources"
        :key="file.id"
        :can-delete="isEditionEnabled"
        :can-edit="isEditionEnabled"
        :resource="file"
        :subtitle="file.description"
        :title="file.title"
        icon="File"
        @edit-clicked="openDrawer(file)"
        @delete-clicked="openModal(file)"
      />
    </div>

    <ConfirmModal
      v-if="confirmModalVisible"
      :content="$t('admin.org-file-confirm-delete')"
      :title="$t('common.delete')"
      :asyncing="asyncing"
      @cancel="confirmModalVisible = false"
      @confirm="deleteResource(currentResource)"
    />

    <LazyOrganizationResourceDrawer
      :is-add-mode="!editedItem"
      :is-opened="isDrawerOpen"
      :selected-item="editedItem"
      @close="isDrawerOpen = false"
      @reload-file-resources="getFileResources"
    />
  </div>
</template>

<style lang="scss" scoped>
.loader {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 5rem 0;
}

.actions-ctn {
  position: absolute;
  top: -20px;
  right: 15px;
  display: flex;

  button:last-of-type {
    margin-left: $space-s;
  }
}

.organization-resources-page {
  .resource-ctn {
    display: flex;
    flex-wrap: wrap;
    gap: $space-m;
    padding: $space-l 0;

    > div {
      width: calc(33% - $space-m);
    }
  }

  .link-header {
    margin-top: $space-l;
  }

  .category-title {
    color: $primary-dark;
    text-transform: uppercase;
    font-size: $font-size-xs;
    font-weight: 700;
  }
}

.add-resource {
  display: flex;
  justify-content: flex-end;
  padding: $space-l 0;
}

@media screen and (max-width: $max-tablet) {
  .organization-resources-page .resource-ctn {
    > div {
      width: calc(50% - $space-m);
    }
  }
}

@media screen and (max-width: $min-tablet) {
  .organization-resources-page .resource-ctn {
    > div {
      width: 100%;
    }
  }
}
</style>
