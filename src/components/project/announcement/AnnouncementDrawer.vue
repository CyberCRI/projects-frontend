<template>
    <div>
        <BaseDrawer
            :confirm-action-name="$t('common.save')"
            :is-opened="isOpened"
            :title="
                $filters.capitalize(
                    isAddMode ? $t('recruit.add-announcement') : $t('recruit.edit-announcement')
                )
            "
            class="medium"
            @close="close"
            @confirm="submit"
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
                    />
                    <p
                        v-for="error of v$.form.title.$errors"
                        :key="error.$uid"
                        class="error-description"
                    >
                        {{ error.$message }}
                    </p>
                </div>
                <div class="form-section description-section">
                    <label class="label"
                        >{{ $filters.capitalize($t('common.description')) }}:</label
                    >
                    <TipTapEditor
                        :key="editorKey"
                        :ws-data="form.description"
                        class="description-field"
                        @update="updateContent"
                    />

                    <p
                        v-for="error of v$.form.description.savedContent.$errors"
                        :key="error.$uid"
                        class="error-description"
                    >
                        {{ error.$message }}
                    </p>
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

export default {
    name: 'AnnouncementDrawer',

    emits: ['close'],

    components: {
        ConfirmModal,
        BaseDrawer,
        GroupButton,
        SwitchInput,
        TextInput,
        TipTapEditor,
        DatePicker,
    },

    data() {
        return {
            v$: useVuelidate(),
            editorKey: 0,
            hasDeadline: false,
            confirmModalIsOpen: false,
            form: {
                title: '',
                description: {
                    originalContent: '',
                    room: '',
                    savedContent: '',
                },
                deadline: new Date(),
                type: 'na',
            },
        }
    },

    validations() {
        return {
            form: {
                title: {
                    required: helpers.withMessage(this.$t('form.announcement.title'), required),
                },
                description: {
                    savedContent: {
                        required: helpers.withMessage(
                            this.$t('form.announcement.description'),
                            required
                        ),
                    },
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
                ? this.announcement.title === this.form.title
                : this.form.title !== ''
        },
    },

    props: {
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

    methods: {
        async submit() {
            const isValid = await this.v$.$validate()

            if (isValid) {
                const body = {
                    ...this.form,
                    deadline: this.hasDeadline
                        ? utils.fullYearDateFormat(new Date(this.form.deadline))
                        : null,
                    description:
                        this.form.description.savedContent || this.form.description.originalContent,
                    project_id: this.$store.getters['projects/currentProjectId'],
                }

                if (this.isAddMode) {
                    try {
                        await this.$store.dispatch('announcements/postAnnouncement', body)
                        this.$store.dispatch('notifications/pushToast', {
                            message: this.$t('toasts.announcement-create.success'),
                            type: 'success',
                        })
                    } catch (error) {
                        this.$store.dispatch('notifications/pushToast', {
                            message: `${this.$t('toasts.announcement-create.error')} (${error})`,
                            type: 'error',
                        })
                        console.error(error)
                    } finally {
                        this.closeNoConfirm()
                    }
                } else {
                    try {
                        await this.$store.dispatch('announcements/patchAnnouncement', body)
                        this.$store.dispatch('notifications/pushToast', {
                            message: this.$t('toasts.announcement-update.success'),
                            type: 'success',
                        })
                    } catch (error) {
                        this.$store.dispatch('notifications/pushToast', {
                            message: `${this.$t('toasts.announcement-update.error')} (${error})`,
                            type: 'error',
                        })
                        console.error(error)
                    } finally {
                        this.closeNoConfirm()
                    }
                }
            }
        },

        toggleConfirmModal() {
            this.confirmModalIsOpen = !this.confirmModalIsOpen
        },

        close() {
            if (
                this.form.description.originalContent !== this.form.description.savedContent ||
                this.titleChanged
            ) {
                this.toggleConfirmModal()
            } else {
                this.closeNoConfirm()
            }
        },

        closeNoConfirm() {
            this.v$.$reset()
            this.$emit('close')
        },

        confirmClose() {
            this.toggleConfirmModal()
            this.closeNoConfirm()
        },

        forceRerender() {
            this.editorKey += 1
        },

        updateContent(htmlContent) {
            this.form.description.savedContent = htmlContent

            if (htmlContent === '<p></p>') this.form.description.savedContent = null
        },
    },

    watch: {
        isOpened: {
            handler: function () {
                if (this.isAddMode) {
                    this.hasDeadline = false
                    this.form = {
                        title: '',
                        description: {
                            originalContent: '',
                            room: '',
                            savedContent: '',
                        },
                        deadline: new Date(),
                        type: 'na',
                    }
                } else {
                    this.form = {
                        ...this.announcement,
                        description: {
                            originalContent: this.announcement.description,
                            room: '',
                            savedContent: '',
                        },
                    }
                    this.hasDeadline = !!this.announcement.deadline
                    this.$nextTick(() => {
                        this.forceRerender()
                    })
                }
            },
            immediate: true,
        },
    },
}
</script>

<style lang="scss" scoped>
.announcement-form,
.description-section {
    display: flex;
    flex-flow: column nowrap;
    flex-grow: 1;
}

.description-field {
    flex-grow: 1;
}

.form-section:not(:first-child) {
    margin-top: $space-l;
}

.label {
    font-size: $font-size-s;
    font-weight: bold;
    margin-bottom: $space-m;
    color: $black;
}

.datepicker {
    margin-top: $space-m;
}

.error {
    color: $salmon-dark;
    margin-top: $space-s;
    font-size: $font-size-s;
}
</style>