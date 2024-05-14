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

export default {
    name: 'LocationForm',

    emits: ['close', 'center-map'],

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
                const result = await this.$store.dispatch('locations/postLocations', {
                    ...this.form,
                    lat: this.newCoordinates[0],
                    lng: this.newCoordinates[1],
                    project_id: this.$store.getters['projects/currentProjectId'],
                })

                await this.$store.dispatch('projects/updateLocationMapPoint', {
                    location: result,
                    mode: 'add',
                })

                this.$store.dispatch('notifications/pushToast', {
                    message: this.$t('toasts.location-create.success'),
                    type: 'success',
                })

                this.$emit('center-map')
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
                const result = await this.$store.dispatch('locations/patchLocation', this.form)

                await this.$store.dispatch('projects/updateLocationMapPoint', {
                    location: result,
                    mode: 'edit',
                })

                this.$store.dispatch('notifications/pushToast', {
                    message: this.$t('toasts.location-update.success'),
                    type: 'success',
                })
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
                await this.$store.dispatch('projects/updateLocationMapPoint', {
                    location: this.form,
                    mode: 'delete',
                })
                await this.$store.dispatch('locations/deleteLocation', this.form)

                this.$store.dispatch('notifications/pushToast', {
                    message: this.$t('toasts.location-delete.success'),
                    type: 'success',
                })

                analytics.location.deleteLocationMapPoint({
                    project: {
                        id: this.$store.getters['projects/currentProjectId'],
                    },
                    location: this.form,
                })
                this.$emit('center-map')
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
    background: $salmon-dark;
    width: 100%;
    padding: $space-m 0;
    font-weight: 700;
    text-transform: capitalize;
    cursor: pointer;
    border: none;
    border-top: $border-width-s solid $green;
}
</style>
