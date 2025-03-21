<template>
  <DialogModal
    :confirm-button-label="locationToBeEdited ? $t('common.edit') : $t('common.add')"
    :cancel-button-label="$t('common.cancel')"
    :asyncing="asyncing"
    @close="$emit('close')"
    @submit="submit"
  >
    <template #header>
      {{
        locationToBeEdited ? $t('project.edit-location-point') : $t('project.add-location-point')
      }}
    </template>

    <template #body>
      <h2 v-if="!locationToBeEdited && newCoordinates.length" class="new-coords">
        {{ $filters.capitalize($t('project.at-coordinates')) }} {{ newCoordinates[0] }} /
        {{ newCoordinates[1] }}
      </h2>

      <div class="location-type-ctn">
        <div class="location-type-label">
          {{ $t('project.location-type-label') }}
        </div>
        <GroupButton v-model="form.type" :options="locationTypeOptions" />
      </div>

      <TextInput v-model="form.title" :label="$filters.capitalize($t('common.title'))" />

      <TextInput
        v-model="form.description"
        input-type="textarea"
        :label="$filters.capitalize($t('common.description'))"
        class="description-input"
      />
    </template>

    <template v-if="locationToBeEdited" #extra-buttons>
      <LpiButton
        class="delete-button"
        :disabled="asyncing"
        :btn-icon="asyncing ? 'LoaderSimple' : null"
        :label="$filters.capitalize($t('common.delete'))"
        @click="deleteLocation"
      />
    </template>
  </DialogModal>
</template>

<script>
import DialogModal from '@/components/base/modal/DialogModal.vue'
import TextInput from '@/components/base/form/TextInput.vue'
import GroupButton from '@/components/base/button/GroupButton.vue'
import analytics from '@/analytics'
import { postLocations, patchLocation, deleteLocation } from '@/api/locations.services'
import useToasterStore from '@/stores/useToaster.ts'
import LpiButton from '@/components/base/button/LpiButton.vue'

export default {
  name: 'LocationForm',

  components: { DialogModal, TextInput, GroupButton, LpiButton },

  props: {
    locationToBeEdited: {
      type: Object,
      default: null,
    },

    newCoordinates: {
      type: Array,
      default: () => [],
    },

    projectId: {
      type: String,
      default: null,
    },
  },

  emits: ['close', 'center-map', 'location-edited', 'location-created', 'location-deleted'],
  setup() {
    const toaster = useToasterStore()
    return {
      toaster,
    }
  },

  data() {
    return {
      asyncing: false,
      form: {
        type: 'team',
        title: '',
        description: '',
      },
      locationTypeOptions: [
        {
          value: 'team',
          label: this.$t('team.team'),
        },
        {
          value: 'impact',
          label: this.$t('project.impact'),
        },
      ],
    }
  },

  created() {
    if (this.locationToBeEdited) {
      this.form = { ...this.locationToBeEdited }
    }
  },

  methods: {
    submit() {
      if (this.locationToBeEdited) this.editLocation()
      else this.addLocation()
    },

    async addLocation() {
      try {
        this.asyncing = true
        const location = {
          ...this.form,
          lat: this.newCoordinates[0],
          lng: this.newCoordinates[1],
          project_id: this.projectId,
        }
        const result = await postLocations(location)

        analytics.location.addLocationMapPoint({
          project: {
            id: this.projectId,
          },
          location: result,
        })

        this.toaster.pushSuccess(this.$t('toasts.location-create.success'))

        this.$emit('location-created')
        this.$nextTick(() => this.$emit('center-map'))
      } catch (error) {
        this.toaster.pushError(`${this.$t('toasts.location-create.error')} (${error})`)
        console.error(error)
      } finally {
        this.$emit('close')
        this.asyncing = false
      }
    },

    async editLocation() {
      try {
        this.asyncing = true
        const result = await patchLocation(this.form)

        analytics.location.updateLocationMapPoint({
          project: {
            id: this.projectId,
          },
          location: result,
        })

        this.toaster.pushSuccess(this.$t('toasts.location-update.success'))

        this.$emit('location-edited')
      } catch (error) {
        this.toaster.pushError(`${this.$t('toasts.location-update.error')} (${error})`)
        console.error(error)
      } finally {
        this.$emit('close')
        this.asyncing = false
      }
    },

    async deleteLocation() {
      try {
        this.asyncing = true
        await deleteLocation(this.form)

        analytics.location.deleteLocationMapPoint({
          project: {
            id: this.projectId,
          },
          location: this.form,
        })

        this.toaster.pushSuccess(this.$t('toasts.location-delete.success'))

        this.$emit('location-deleted')
        this.$nextTick(() => this.$emit('center-map'))
      } catch (error) {
        this.toaster.pushError(`${this.$t('toasts.location-delete.error')} (${error})`)
        console.error(error)
      } finally {
        this.$emit('close')
        this.asyncing = true
      }
    },
  },
}
</script>

<style lang="scss" scoped>
.new-coords {
  text-align: center;
  font-style: italic;
  font-weight: normal;
}

.description-input {
  margin-top: $space-m;
}

.location-type-ctn {
  margin: $space-m 0;

  .location-type-label {
    font-size: $font-size-s;
    color: $primary-dark;
    font-weight: bold;
    margin-bottom: $space-2xs;
  }
}

.delete-button {
  color: $white;
  background: $salmon;
}
</style>
