<template>
  <div class="project-locations">
    <div v-if="editable" class="actions">
      <LpiButton
        btn-icon="Plus"
        class="edit-btn"
        :label="$t('project.add-location')"
        @click="projectLayoutToggleAddModal('location')"
      />
    </div>

    <div class="main-ctn">
      {{ editable }}
      <LazyMapRecap
        ref="map"
        class="unboxed"
        expand
        :editable="editable"
        :locations="locations"
        @expand="projectLayoutToggleAddModal('location')"
      />
    </div>
    <LocationList
      :locations="locations"
      :editable="editable"
      @focus="onFocus($event)"
      @edit="onEditForm($event)"
      @delete="locationToDelete = $event"
    />
    <LocationForm
      v-if="formVisible"
      v-model="form"
      @close="onCloseForm()"
      @submit="onSubmit(form)"
      @delete="onDelete(form)"
    />
    <ConfirmModal
      v-if="locationToDelete"
      :asyncing="asyncing"
      :title="$t('geocoding.delete-location')"
      :content="$t('geocoding.confirm-delete-location')"
      @cancel="locationToDelete = null"
      @confirm="onDelete(locationToDelete)"
    />
  </div>
</template>

<script setup lang="ts">
import useToasterStore from '@/stores/useToaster'
import analytics from '@/analytics'
import { deleteLocation, patchLocation, postLocations } from '@/api/locations.services'
import { TranslatedLocation } from '@/models/location.model'
import { TranslatedProject } from '@/models/project.model'
import LocationList from '@/components/map/LocationList.vue'
import LocationForm from '@/components/map/LocationForm.vue'

const projectLayoutToggleAddModal: any = inject('projectLayoutToggleAddModal')

const props = withDefaults(
  defineProps<{
    project: TranslatedProject
    locations?: TranslatedLocation[]
    isInEditingMode?: boolean
  }>(),
  {
    locations: () => [],
    isInEditingMode: false,
  }
)
const form = ref()

const emit = defineEmits(['reload'])
const { canEditProject } = usePermissions()
const { t } = useNuxtI18n()
const toaster = useToasterStore()
const formVisible = ref(false)
const locationToDelete = ref<TranslatedLocation>(null)
const asyncing = ref(false)

const mapRef = useTemplateRef('map')
const centerMap = () => mapRef.value?.map?.centerMap()
const onFocus = (location) => mapRef.value?.map?.flyTo(location)

const editable = computed(() => props.isInEditingMode && canEditProject.value)

const onCloseForm = () => (formVisible.value = formVisible.value = false)

const onCreate = async (body) => {
  try {
    asyncing.value = true
    await postLocations(props.project.id, body)

    analytics.location.addLocationMapPoint({
      project: {
        id: props.project.id,
      },
      location: body,
    })

    toaster.pushSuccess(t('toasts.location-create.success'))

    emit('reload')
    nextTick(() => centerMap())
  } catch (error) {
    toaster.pushError(`${t('toasts.location-create.error')} (${error})`)
    console.error(error)
  } finally {
    asyncing.value = false
    onCloseForm()
  }
}

const onEdit = async (body) => {
  try {
    asyncing.value = true
    await patchLocation(props.project.id, body.id, body)

    analytics.location.updateLocationMapPoint({
      project: {
        id: props.project.id,
      },
      location: body,
    })

    toaster.pushSuccess(t('toasts.location-update.success'))

    emit('reload')
  } catch (error) {
    toaster.pushError(`${t('toasts.location-update.error')} (${error})`)
    console.error(error)
  } finally {
    asyncing.value = false
    onCloseForm()
  }
}

const onDelete = async (body) => {
  try {
    asyncing.value = true
    await deleteLocation(props.project.id, body.id)

    analytics.location.deleteLocationMapPoint({
      project: {
        id: props.project.id,
      },
      location: body,
    })

    toaster.pushSuccess(t('toasts.location-delete.success'))

    emit('reload')
    nextTick(() => centerMap())
  } catch (error) {
    toaster.pushError(`${t('toasts.location-delete.error')} (${error})`)
    console.error(error)
  } finally {
    asyncing.value = false
    locationToDelete.value = null
    onCloseForm()
  }
}

const onSubmit = (eventForm) => {
  const body = {
    ...eventForm,
    project_id: props.project.id,
  }

  if (body.id) {
    onEdit(body)
  } else {
    onCreate(body)
  }
}

const onEditForm = (location) => {
  form.value = { ...location }
  formVisible.value = true
}
</script>
<style scoped lang="scss">
.actions {
  margin-bottom: 1rem;
  display: flex;
  justify-content: flex-end;
  align-items: center;
  gap: 1rem;
}
</style>
