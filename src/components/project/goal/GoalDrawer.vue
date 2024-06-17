<template>
    <BaseDrawer
        @close="closeModal"
        @confirm="submit"
        :title="$t('goal.add')"
        :confirm-action-name="$t('common.save')"
        :confirm-action-disabled="v$.$invalid"
        :is-opened="isOpened"
        class="medium"
        :asyncing="asyncing"
    >
        <div class="form">
            <TextInput
                v-model="form.title"
                :label="$filters.capitalize(`${$t('goal.title')}:`)"
                :placeholder="$filters.capitalize($t('goal.title'))"
                @blur="v$.form.title.$touch"
            />
            <FieldErrors :errors="v$.form.title.$errors" />

            <div class="goal-description-section">
                <span class="goal-label">{{ $filters.capitalize($t('goal.description')) }}:</span>
                <TipTapEditor
                    class="goal-description"
                    :ws-data="form.description"
                    @update="updateGoalDescription"
                    @blur="v$.form.description.$touch"
                />
                <FieldErrors :errors="v$.form.description.savedContent.$errors" />
            </div>

            <SwitchInput
                class="deadline-switch"
                v-model="deadlineVisible"
                :label="$filters.capitalize(`${$t('common.set-deadline')}:`)"
            />

            <DatePicker
                v-if="deadlineVisible"
                class="goal-deadline"
                v-model="form.deadline_at"
                position="top"
            />

            <div class="status-ctn">
                <span class="goal-label">{{ $filters.capitalize($t('goal.status-title')) }}:</span>
                <GroupButton
                    v-model="form.status"
                    class="group-button-labels"
                    :options="statusOptions"
                    :custom-color="statusColor"
                />
            </div>
        </div>
    </BaseDrawer>
    <ConfirmModal
        v-if="showConfirmModal"
        @cancel="showConfirmModal = false"
        @confirm="closeModalAndDrawer"
        confirm-button-label="common.continue"
        :title="$t('description.quit-without-saving-title')"
        :content="$t('common.confirm-close')"
    />
</template>

<script>
import BaseDrawer from '@/components/base/BaseDrawer.vue'
import TextInput from '@/components/base/form/TextInput.vue'
import TipTapEditor from '@/components/base/form/TextEditor/TipTapEditor.vue'
import SwitchInput from '@/components/base/form/SwitchInput.vue'
import DatePicker from '@/components/base/form/DatePicker.vue'
import GroupButton from '@/components/base/button/GroupButton.vue'

import utils from '@/functs/functions.ts'

import useVuelidate from '@vuelidate/core'
import { required, helpers } from '@vuelidate/validators'
import ConfirmModal from '@/components/base/modal/ConfirmModal.vue'
import FieldErrors from '@/components/base/form/FieldErrors.vue'

export default {
    name: 'GoalDrawer',

    emits: ['close'],

    components: {
        ConfirmModal,
        BaseDrawer,
        TextInput,
        TipTapEditor,
        DatePicker,
        SwitchInput,
        GroupButton,
        FieldErrors,
    },

    props: {
        isAddMode: {
            type: Boolean,
            default: true,
        },

        isOpened: {
            type: Boolean,
            default: false,
        },

        editedGoal: {
            type: Object,
            default: () => {},
        },
    },

    data() {
        return {
            v$: useVuelidate(),
            form: {
                title: '',
                description: {
                    originalContent: '',
                    savedContent: '',
                    room: '',
                },
                deadline_at: new Date(),
                status: 'na',
            },
            deadlineVisible: false,
            showConfirmModal: false,
            asyncing: false,
        }
    },

    validations() {
        return {
            form: {
                title: {
                    required: helpers.withMessage(this.$t('form.goal.title'), required),
                },
                description: {
                    savedContent: {
                        required: helpers.withMessage(this.$t('form.goal.description'), required),
                    },
                },
            },
        }
    },

    computed: {
        project() {
            return this.$store.getters['projects/project']
        },

        projectSlug() {
            return this.$store.getters['projects/currentProjectSlug']
        },

        statusColor() {
            if (this.form.status === 'ongoing') return '#99FFE7'
            else if (this.form.status === 'complete') return '#00DBA7'
            else if (this.form.status === 'cancel') return '#D4D4D4'
            return '#F0FFFB' /* for "na" */
        },

        statusOptions() {
            return [
                {
                    value: 'na',
                    label: this.$filters.capitalize(this.$t('status.na')),
                    selected: this.form.status === 'na',
                },
                {
                    value: 'ongoing',
                    label: this.$filters.capitalize(this.$t('status.ongoing')),
                    selected: this.form.status === 'ongoing',
                },
                {
                    value: 'complete',
                    label: this.$filters.capitalize(this.$t('status.completed')),
                    selected: this.form.status === 'complete',
                },
                {
                    value: 'cancel',
                    label: this.$filters.capitalize(this.$t('status.canceled')),
                    selected: this.form.status === 'cancel',
                },
            ]
        },
    },

    methods: {
        fillForm() {
            this.form.id = this.editedGoal.id
            this.form.title = this.editedGoal.title
            this.form.description.originalContent = this.editedGoal.description
            this.form.description.savedContent = this.editedGoal.description
            this.form.deadline_at = this.editedGoal.deadline_at
            this.form.status = this.editedGoal.status
            this.deadlineVisible = !!this.editedGoal.deadline_at
        },

        resetForm() {
            this.form = {
                title:
                    this.project && this.project.template
                        ? this.project.template.goal_placeholder
                        : '',
                description: {
                    originalContent:
                        this.project && this.project.template
                            ? this.project.template.goal_description
                            : '',
                    savedContent:
                        this.project && this.project.template
                            ? this.project.template.goal_description
                            : '',
                    room: '',
                },
                deadline_at: new Date(),
                status: 'na',
            }
            this.deadlineVisible = false
        },

        async submit() {
            const isValid = await this.v$.$validate()

            if (isValid) {
                this.asyncing = true
                const payload = {
                    ...this.form,
                    project_id: this.project.id,
                    description: this.form.description.savedContent,
                    deadline_at: this.form.deadline_at
                        ? utils.fullYearDateFormat(this.form.deadline_at)
                        : null,
                }
                if (this.form.id) {
                    // Update goal
                    try {
                        await this.$store.dispatch('goals/patchGoal', payload)
                        this.$store.dispatch('notifications/pushToast', {
                            message: this.$t('toasts.goal-update.success'),
                            type: 'success',
                        })
                    } catch (error) {
                        this.$store.dispatch('notifications/pushToast', {
                            message: `${this.$t('toasts.goal-update.error')} (${error})`,
                            type: 'error',
                        })
                        console.error(error)
                    } finally {
                        this.asyncing = false
                        this.closeModalNoConfirm()
                    }
                } else {
                    // Create goal
                    try {
                        await this.$store.dispatch('goals/createGoal', payload)
                        this.$store.dispatch('notifications/pushToast', {
                            message: this.$t('toasts.goal-create.success'),
                            type: 'success',
                        })
                        if (this.$route.name !== 'projectGoals') {
                            this.$router.push({
                                name: 'projectGoals',
                                params: { slugOrId: this.projectSlug },
                            })
                        }
                    } catch (error) {
                        this.$store.dispatch('notifications/pushToast', {
                            message: `${this.$t('toasts.goal-create.error')} (${error})`,
                            type: 'error',
                        })
                        console.error(error)
                    } finally {
                        this.asyncing = false
                        this.closeModalNoConfirm()
                    }
                }
            }
        },

        updateGoalDescription(htmlContent) {
            this.form.description.savedContent = htmlContent
            if (htmlContent === '<p></p>') this.form.description.savedContent = null
        },

        openConfirmModal() {
            this.showConfirmModal = !this.showConfirmModal
        },

        closeModal() {
            if (this.asyncing) return
            if (this.form.description.originalContent !== this.form.description.savedContent)
                this.showConfirmModal = !this.showConfirmModal
            else {
                this.closeModalNoConfirm()
            }
        },

        closeModalNoConfirm() {
            if (this.asyncing) return
            this.v$.$reset()
            this.$emit('close')
        },

        closeModalAndDrawer() {
            this.openConfirmModal()
            this.closeModalNoConfirm()
        },
    },

    watch: {
        deadlineVisible: function (val) {
            if (!val) this.form.deadline_at = null
        },

        isOpened: {
            handler: function () {
                if (!this.isAddMode) this.fillForm()
                else this.resetForm()
            },
            immediate: true,
        },
    },
}
</script>

<style lang="scss" scoped>
.form,
.goal-description-section {
    display: flex;
    flex-flow: column nowrap;
    flex-grow: 1;
}

.goal-title,
.goal-description,
.deadline-switch,
.goal-deadline {
    margin-bottom: $space-m;
}

.goal-description {
    flex-grow: 1;
}

.status-ctn {
    display: flex;
    align-items: center;

    > span {
        margin-right: $space-m;
    }
}

.goal-label {
    font-size: $font-size-s;
    color: $primary-dark;
    font-weight: bold;
    margin-bottom: $space-2xs;
}

// This is an overwrite on a co-existing style that is only here
:deep(.label-selected) {
    color: $black;
}
</style>
