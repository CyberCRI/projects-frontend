<template>
    <div>
        <BaseDrawer
            :confirm-action-name="$t('common.save')"
            :confirm-action-disabled="v$.$invalid"
            :is-opened="isOpened"
            :title="
                $filters.capitalize(
                    isAddMode ? $t('recruit.add-announcement') : $t('recruit.edit-announcement')
                )
            "
            class="medium"
            @close="close"
            @confirm="submit"
            :asyncing="asyncing"
        >
            <div class="announcement-form">
                <div class="form-section">
                    <label class="label">{{ $filters.capitalize($t('recruit.type')) }}:</label>
                    <GroupButton v-model="form.type" :options="typeOptions" />
                </div>

                <div class="form-section">
                    <TextInput
                        v-model="form.title"
                        :label="$filters.capitalize(`${$t('recruit.title')}:`)"
                        :placeholder="$t('recruit.title')"
                        class="form-section"
                        @blur="v$.form.title.$touch"
                    />
                    <FieldErrors :errors="v$.form.title.$errors" />
                </div>
                <div class="form-section description-section">
                    <label class="label"
                        >{{ $filters.capitalize($t('common.description')) }}:</label
                    >
                    <TipTapEditor
                        v-model="form.description"
                        class="description-field"
                        @blur="v$.form.description.$validate"
                    />

                    <FieldErrors :errors="v$.form.description.$errors" />
                </div>
                <div class="form-section">
                    <SwitchInput
                        v-model="hasDeadline"
                        :label="$filters.capitalize(`${$t('common.deadline')}:`)"
                        class="vertical black-label"
                    />
                    <DatePicker
                        v-if="hasDeadline"
                        v-model="form.deadline"
                        class="datepicker"
                        position="top"
                    />
                </div>
            </div>
        </BaseDrawer>

        <ConfirmModal
            v-if="confirmModalIsOpen"
            :content="$t('common.confirm-close')"
            :title="$t('description.quit-without-saving-title')"
            confirm-button-label="common.continue"
            @cancel="confirmModalIsOpen = false"
            @confirm="confirmClose"
        />
    </div>
</template>

<script>
import BaseDrawer from '@/components/base/BaseDrawer.vue'
import GroupButton from '@/components/base/button/GroupButton.vue'
import SwitchInput from '@/components/base/form/SwitchInput.vue'
import TextInput from '@/components/base/form/TextInput.vue'
import TipTapEditor from '@/components/base/form/TextEditor/TipTapEditor.vue'
import DatePicker from '@/components/base/form/DatePicker.vue'

import utils from '@/functs/functions.ts'
import useVuelidate from '@vuelidate/core'
import { helpers, required } from '@vuelidate/validators'
import ConfirmModal from '@/components/base/modal/ConfirmModal.vue'
import FieldErrors from '@/components/base/form/FieldErrors.vue'

import { postAnnouncement, patchAnnouncement } from '@/api/announcements.service'
import analytics from '@/analytics'

import useToasterStore from '@/stores/useToaster.ts'

export default {
    name: 'AnnouncementDrawer',

    emits: ['close', 'reload-announcements'],

    components: {
        ConfirmModal,
        BaseDrawer,
        GroupButton,
        SwitchInput,
        TextInput,
        TipTapEditor,
        DatePicker,
        FieldErrors,
    },

    setup() {
        const toaster = useToasterStore()
        return {
            toaster,
        }
    },

    props: {
        project: {
            type: Object,
            default: () => ({}),
        },

        announcement: {
            type: Object || null,
            default: null,
        },

        isAddMode: {
            type: Boolean,
            default: true,
        },

        isOpened: {
            type: Boolean,
            default: false,
        },
    },

    data() {
        return {
            v$: useVuelidate(),
            hasDeadline: false,
            confirmModalIsOpen: false,
            form: {
                title: '',
                description: '<p></p>',
                deadline: new Date(),
                type: 'na',
            },
            asyncing: false,
        }
    },

    validations() {
        return {
            form: {
                title: {
                    required: helpers.withMessage(this.$t('form.announcement.title'), required),
                },
                description: {
                    required: helpers.withMessage(
                        this.$t('form.announcement.description'),
                        required
                    ),
                },
            },
        }
    },

    computed: {
        typeOptions() {
            return [
                {
                    value: 'na',
                    label: this.$filters.capitalize(this.$t('common.none')),
                },
                {
                    value: 'participant',
                    label: this.$filters.capitalize(this.$t('recruit.participant')),
                },
                {
                    value: 'traineeship',
                    label: this.$filters.capitalize(this.$t('recruit.traineeship')),
                },
                {
                    value: 'job',
                    label: this.$filters.capitalize(this.$t('recruit.job')),
                },
            ]
        },

        titleChanged() {
            return this.announcement
                ? this.announcement.title !== this.form.title
                : this.form.title !== ''
        },

        descriptionChanged() {
            return this.announcement
                ? this.announcement.description !== this.form.description
                : this.form.description !== '<p></p>'
        },
    },

    methods: {
        async submit() {
            const isValid = await this.v$.$validate()

            if (isValid) {
                this.asyncing = true
                const body = {
                    ...this.form,
                    deadline: this.hasDeadline
                        ? utils.fullYearDateFormat(new Date(this.form.deadline))
                        : null,
                    description: this.form.description,
                    project_id: this.project.id,
                }

                if (this.isAddMode) {
                    try {
                        const result = await postAnnouncement(body)
                        analytics.announcement.addAnnouncement({
                            project: {
                                id: this.project.id,
                            },
                            announcement: result,
                        })

                        this.toaster.pushSuccess(this.$t('toasts.announcement-create.success'))
                    } catch (error) {
                        this.toaster.pushError(
                            `${this.$t('toasts.announcement-create.error')} (${error})`
                        )
                        console.error(error)
                    } finally {
                        this.$emit('reload-announcements')
                        this.asyncing = false
                        this.closeNoConfirm()
                    }
                } else {
                    try {
                        const result = await patchAnnouncement(body)

                        analytics.announcement.updateAnnouncement({
                            project: {
                                id: this.project.id,
                            },
                            announcement: result,
                        })

                        this.toaster.pushSuccess(this.$t('toasts.announcement-update.success'))
                    } catch (error) {
                        this.toaster.pushError(
                            `${this.$t('toasts.announcement-update.error')} (${error})`
                        )
                        console.error(error)
                    } finally {
                        this.$emit('reload-announcements')
                        this.asyncing = false
                        this.closeNoConfirm()
                    }
                }
            }
        },

        toggleConfirmModal() {
            if (this.asyncing) return
            this.confirmModalIsOpen = !this.confirmModalIsOpen
        },

        close() {
            if (this.descriptionChanged || this.titleChanged) {
                this.toggleConfirmModal()
            } else {
                this.closeNoConfirm()
            }
        },

        closeNoConfirm() {
            if (this.asyncing) return
            this.v$.$reset()
            this.$emit('close')
        },

        confirmClose() {
            if (this.asyncing) return
            this.toggleConfirmModal()
            this.closeNoConfirm()
        },
    },

    watch: {
        isOpened: {
            handler: function () {
                if (this.isAddMode) {
                    this.hasDeadline = false
                    this.form = {
                        title: '',
                        description: '<p></p>',
                        deadline: new Date(),
                        type: 'na',
                    }
                } else {
                    this.form = {
                        ...this.announcement,
                    }
                    this.hasDeadline = !!this.announcement.deadline
                }
            },
            immediate: true,
        },
    },
}
</script>

<style lang="scss" scoped>
.announcement-form {
    overflow: hidden;
}

.announcement-form,
.description-section {
    display: flex;
    flex-flow: column nowrap;
    flex-grow: 1;
}

.description-field {
    flex-grow: 1;
}

.description-section {
    overflow: auto;
}

.form-section:not(:first-child) {
    margin-top: $space-l;
}

.label {
    font-size: $font-size-s;
    font-weight: bold;
    margin-bottom: $space-m;
    color: $black;
    margin-right: 1rem;
}

.datepicker {
    margin-top: $space-m;
}
</style>
