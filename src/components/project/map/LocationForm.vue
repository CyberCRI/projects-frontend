<template>
    <DialogModal @close="$emit('close')" @submit="submit">
        <template #header>
            {{
                locationToBeEdited
                    ? $t('project.edit-location-point')
                    : $t('project.add-location-point')
            }}
        </template>

        <template #body>
            <h2 v-if="!locationToBeEdited && newCoordinates.length" class="new-coords">
                {{ $filters.capitalize($t('project.at-coordinates')) }} {{ newCoordinates[0] }} /
                {{ newCoordinates[1] }}
            </h2>

            <div class="location-type-ctn">
                <div class="location-type-label">{{ $t('project.location-type-label') }}</div>
                <GroupButton v-model="form.type" :options="locationTypeOptions" />
            </div>

            <TextInput v-model="form.title" :label="$filters.capitalize($t('common.title'))" />

            <TextInput
                input-type="textarea"
                v-model="form.description"
                :label="$filters.capitalize($t('common.description'))"
                class="description-input"
            />
        </template>

        <template #button-1>{{ $t('common.cancel') }}</template>
        <template #extra-buttons v-if="locationToBeEdited">
            <button @click="deleteLocation" class="delete-button">
                {{ $filters.capitalize($t('common.delete')) }}
            </button>
        </template>
        <template #button-2
            >{{ locationToBeEdited ? $t('common.edit') : $t('common.add') }}
        </template>
    </DialogModal>
</template>

<script>
import DialogModal from '@/components/base/modal/DialogModal.vue'
import TextInput from '@/components/base/form/TextInput.vue'
import GroupButton from '@/components/base/button/GroupButton.vue'
import analytics from '@/analytics'
import { postLocations, patchLocation, deleteLocation } from '@/api/locations.services'

export default {
    name: 'LocationForm',

    emits: ['close', 'center-map', 'location-edited', 'location-created', 'location-deleted'],

    components: { DialogModal, TextInput, GroupButton },

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

    created() {
        if (this.locationToBeEdited) {
            this.form = { ...this.locationToBeEdited }
        }
    },

    data() {
        return {
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

    methods: {
        submit() {
            if (this.locationToBeEdited) this.editLocation()
            else this.addLocation()
        },

        async addLocation() {
            try {
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

                this.$store.dispatch('notifications/pushToast', {
                    message: this.$t('toasts.location-create.success'),
                    type: 'success',
                })
                this.$emit('location-created')
                this.$nextTick(() => this.$emit('center-map'))
            } catch (error) {
                this.$store.dispatch('notifications/pushToast', {
                    message: `${this.$t('toasts.location-create.error')} (${error})`,
                    type: 'error',
                })
                console.error(error)
            } finally {
                this.$emit('close')
            }
        },

        async editLocation() {
            try {
                const result = await patchLocation(this.form)

                analytics.location.updateLocationMapPoint({
                    project: {
                        id: this.projectId,
                    },
                    location: result,
                })

                this.$store.dispatch('notifications/pushToast', {
                    message: this.$t('toasts.location-update.success'),
                    type: 'success',
                })

                this.$emit('location-edited')
            } catch (error) {
                this.$store.dispatch('notifications/pushToast', {
                    message: `${this.$t('toasts.location-update.error')} (${error})`,
                    type: 'error',
                })
                console.error(error)
            } finally {
                this.$emit('close')
            }
        },

        async deleteLocation() {
            try {
                await deleteLocation(this.form)

                analytics.location.deleteLocationMapPoint({
                    project: {
                        id: this.projectId,
                    },
                    location: this.form,
                })

                this.$store.dispatch('notifications/pushToast', {
                    message: this.$t('toasts.location-delete.success'),
                    type: 'success',
                })
                this.$emit('location-deleted')
                this.$nextTick(() => this.$emit('center-map'))
            } catch (error) {
                this.$store.dispatch('notifications/pushToast', {
                    message: `${this.$t('toasts.location-delete.error')} (${error})`,
                    type: 'error',
                })
                console.error(error)
            } finally {
                this.$emit('close')
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
    width: 100%;
    padding: $space-m 0;
    font-weight: 700;
    text-transform: capitalize;
    cursor: pointer;
    border: none;
    border-top: $border-width-s solid $primary;
}
</style>
