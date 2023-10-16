<template>
    <div class="form">
        <DialogModal
            @close="closeModal"
            @submit="saveReview"
            :second-button-options="{ disabled: v$.$invalid }"
        >
            <template #header
                >{{
                    $filters.capitalize(
                        mode === 'add' ? $t('project.add-review') : $t('project.edit-review')
                    )
                }}
            </template>

            <template #body>
                <div>
                    <div class="review-entry">
                        <label>{{ $filters.capitalize($t('common.title')) }}</label>
                        <TextInput
                            v-model="newReview.data.title"
                            @blur="v$.newReview.data.title.$touch"
                        />
                        <p
                            v-for="error of v$.newReview.data.title.$errors"
                            :key="error.$uid"
                            class="error-description"
                        >
                            {{ error.$message }}
                        </p>
                    </div>

                    <div class="review-entry">
                        <label>{{ $t('form.description') }}</label>
                        <TipTapEditor
                            :key="editorKey"
                            class="review-container"
                            mode="simple"
                            :socket="false"
                            :ws-data="wsdata"
                            @update="updateContent"
                            :save-icon-visible="false"
                        />
                        <p
                            v-for="error of v$.newReview.data.description.$errors"
                            :key="error.$uid"
                            class="error-description"
                        >
                            {{ error.$message }}
                        </p>
                    </div>
                    <div class="review-entry review-switch">
                        <label>{{ $filters.capitalize($t('project.publish')) }}</label>
                        <SwitchInput v-model="publish" />
                    </div>
                    <div class="review-entry review-switch">
                        <label>{{ $filters.capitalize($t('project.lock')) }}</label>
                        <SwitchInput v-model="lock" />
                    </div>
                </div>
            </template>

            <template #button-1>
                <span>{{ $t('common.cancel') }}</span>
            </template>

            <template #extra-buttons v-if="mode === 'edit'">
                <button
                    :disabled="!canDestroyReview"
                    class="button-footer"
                    @click="confirmModalVisible = true"
                    v-text="$t('common.delete')"
                    data-test="project-window-review-button-delete"
                />
            </template>

            <template #button-2>
                <span>{{ $t('common.save') }}</span>
            </template>
            <ConfirmModal
                v-if="confirmModalVisible"
                :title="$t('common.delete')"
                :content="$t('project.review-confirm-delete')"
                @cancel="confirmModalVisible = false"
                @confirm="deleteReview"
            />
        </DialogModal>
    </div>
</template>

<script>
import TextInput from '@/components/lpikit/TextInput/TextInput.vue'
import TipTapEditor from '@/components/lpikit/TextEditor/TipTapEditor.vue'
import { mapGetters } from 'vuex'
import DialogModal from '@/components/lpikit/DialogModal/DialogModal.vue'
import permissions from '@/mixins/permissions.ts'
import SwitchInput from '@/components/lpikit/SwitchInput/SwitchInput.vue'
import ConfirmModal from '@/components/lpikit/ConfirmModal/ConfirmModal.vue'

import { useVuelidate } from '@vuelidate/core'
import { required, helpers } from '@vuelidate/validators'

export default {
    name: 'ReviewModal',

    mixins: [permissions],

    components: {
        TipTapEditor,
        TextInput,
        DialogModal,
        SwitchInput,
        ConfirmModal,
    },

    props: {
        mode: {
            type: String,
            required: true,
        },

        project: {
            type: Object,
            required: true,
        },

        rdata: {
            type: Object,
            default: () => {},
        },
    },

    setup() {
        return {
            v$: useVuelidate(),
        }
    },

    data() {
        return {
            editorKey: 0,
            wsdata: { originalContent: '' },
            editorOption: {
                modules: {
                    toolbar: [['bold', 'italic', 'underline'], ['link']],
                },
            },
            publish: false,
            lock: true,
            newReview: {
                data: {
                    title: '',
                    description: '',
                    reviewer: '',
                },
            },
            publishOptions: [
                {
                    value: false,
                    label: this.$t('common.no'),
                },
                {
                    value: true,
                    label: this.$t('common.yes'),
                },
            ],
            lockOptions: [
                {
                    value: false,
                    label: this.$t('common.no'),
                },
                {
                    value: true,
                    label: this.$t('common.yes'),
                },
            ],
            confirmModalVisible: false,
        }
    },

    validations() {
        return {
            newReview: {
                data: {
                    title: {
                        required: helpers.withMessage(this.$t('form.review.title'), required),
                        $autoDirty: true,
                    },
                    description: {
                        required: helpers.withMessage(this.$t('form.review.description'), required),
                        $autoDirty: true,
                    },
                },
            },
        }
    },

    computed: {
        ...mapGetters({
            user: 'users/user',
            projectId: 'projects/currentProjectId',
        }),
    },

    mounted() {
        this.newReview.data.reviewer = this.$store.state.users.keycloak_id

        if (this.mode === 'edit') {
            this.publish = this.project.publication_status === 'public'
            this.lock = this.project.is_locked

            this.newReview.id = this.rdata.id
            this.newReview.data = { ...this.rdata }
        }
        this.wsdata = { originalContent: this.newReview.data.description }
        setTimeout(() => {
            this.forceRerender()
        }, 10)
    },

    emits: ['close'],

    methods: {
        forceRerender() {
            this.editorKey += 1
        },

        updateContent(htmlContent) {
            this.wsdata.savedcontent = htmlContent
        },

        async saveReview() {
            // Update review
            this.newReview.data.description = this.wsdata.savedcontent
            if (this.mode === 'add') {
                await this.createReview()
            } else if (this.mode === 'edit') {
                await this.updateReview()
            }

            // Update other project properties
            const projectData = { life_status: 'private', is_locked: false }
            if (this.publish) projectData.publication_status = 'public'
            if (this.lock) {
                projectData.is_locked = true
                projectData.life_status = 'completed'
            } else {
                projectData.life_status = 'running'
            }
            await this.$store.dispatch('projects/updateProject', {
                id: this.project.id,
                project: projectData,
            })

            this.closeModal()
        },

        async createReview() {
            const body = {
                description: this.newReview.data.description,
                title: this.newReview.data.title,
                project_id: this.projectId,
                reviewer_id: this.newReview.data.reviewer,
            }

            try {
                await this.$store.dispatch('reviews/postReview', body)

                this.$store.dispatch('notifications/pushToast', {
                    message: this.$t('toasts.review-create.success'),
                    type: 'success',
                })
            } catch (error) {
                this.$store.dispatch('notifications/pushToast', {
                    message: `${this.$t('toasts.review-create.error')} (${error})`,
                    type: 'error',
                })
                console.error(error)
            }
        },

        async updateReview() {
            let body = {
                description: this.newReview.data.description,
                title: this.newReview.data.title,
                project_id: this.projectId,
                reviewer_id: this.newReview.data.reviewer.keycloak_id,
                id: this.newReview.id,
            }

            try {
                await this.$store.dispatch('reviews/patchReview', body)
                this.$store.dispatch('notifications/pushToast', {
                    message: this.$t('toasts.review-update.success'),
                    type: 'success',
                })
            } catch (error) {
                this.$store.dispatch('notifications/pushToast', {
                    message: `${this.$t('toasts.review-update.error')} (${error})`,
                    type: 'error',
                })
                console.error(error)
            }
        },

        async deleteReview() {
            try {
                await this.$store.dispatch('reviews/deleteReview', this.newReview.id)
                this.$store.dispatch('notifications/pushToast', {
                    message: this.$t('toasts.review-delete.success'),
                    type: 'success',
                })
            } catch (error) {
                this.$store.dispatch('notifications/pushToast', {
                    message: `${this.$t('toasts.review-delete.error')} (${error})`,
                    type: 'error',
                })
                console.error(error)
            } finally {
                this.confirmModalVisible = false
                this.closeModal()
            }
        },

        closeModal() {
            this.$emit('close')
        },
    },
}
</script>

<style lang="scss">
.review-switch {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
}

.review-entry {
    margin-bottom: $space-l;
}

.review-entry:last-child {
    margin-bottom: 0;
}

label {
    display: block;
    font-size: $font-size-l;
    color: $primary-dark;
    font-weight: bold;
    margin-bottom: $space-s;
    text-align: left;
}
</style>
