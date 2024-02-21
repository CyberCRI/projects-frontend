<template>
    <!-- TODO: Change disabled action -->
    <DrawerLayout
        :confirm-action-disabled="v$.$invalid"
        :confirm-action-name="$t('common.save')"
        :is-opened="isOpened"
        :title="
            $filters.capitalize(
                mode === 'add' ? $t('project.add-review') : $t('project.edit-review')
            )
        "
        class="review-drawer medium"
        @close="closeDrawer"
        @confirm="saveReview"
    >
        <div>
            <div class="review-entry">
                <label>{{ $filters.capitalize($t('common.title')) }}</label>
                <TextInput v-model="newReview.data.title" />
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
                    :save-icon-visible="false"
                    :socket="false"
                    :ws-data="wsdata"
                    mode="simple"
                    @update="updateContent"
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
    </DrawerLayout>

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
import TextInput from '@/components/lpikit/TextInput/TextInput.vue'
import TipTapEditor from '@/components/lpikit/TextEditor/TipTapEditor.vue'
import { mapGetters } from 'vuex'
import DrawerLayout from '@/components/lpikit/Drawer/DrawerLayout.vue'
import permissions from '@/mixins/permissions.ts'
import SwitchInput from '@/components/lpikit/SwitchInput/SwitchInput.vue'

import useVuelidate from '@vuelidate/core'
import { helpers, required } from '@vuelidate/validators'
import ConfirmModal from '@/components/lpikit/ConfirmModal/ConfirmModal.vue'

export default {
    name: 'ReviewDrawer',

    mixins: [permissions],

    components: {
        ConfirmModal,
        TipTapEditor,
        TextInput,
        DrawerLayout,
        SwitchInput,
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
        isOpened: {
            type: Boolean,
            default: false,
        },
    },

    data() {
        return {
            v$: useVuelidate(),
            showConfirmModal: false,
            editorKey: 0,
            wsdata: { originalContent: '', savedContent: '' },
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
                        required: helpers.withMessage(this.$t('form.review.message'), required),
                        $autoDirty: true,
                    },
                },
            },
        }
    },

    computed: {
        ...mapGetters({
            projectId: 'projects/currentProjectId',
        }),
    },

    watch: {
        isOpened: {
            handler: function () {
                this.publish = false
                this.lock = true

                if (this.mode === 'edit') {
                    this.publish = this.project.publication_status === 'public'
                    this.lock = this.project.is_locked

                    this.newReview.id = this.rdata.id
                    this.newReview.data = { ...this.rdata }
                } else {
                    this.newReview = {
                        data: {
                            title: '',
                            description: '',
                        },
                    }
                }
                this.newReview.data.reviewer = this.$store.getters['users/id']

                this.wsdata = {
                    originalContent: this.newReview.data.description,
                    savedContent: this.newReview.data.description,
                }
                this.$nextTick(this.forceRerender)
            },
            immediate: true,
        },
    },

    emits: ['close'],

    methods: {
        forceRerender() {
            this.editorKey += 1
        },

        updateContent(htmlContent) {
            this.wsdata.savedContent = htmlContent
            this.newReview.data.description = htmlContent

            if (htmlContent === '<p></p>') this.newReview.data.description = null
        },

        async saveReview() {
            const isValid = await this.v$.$validate()
            // Update review
            this.newReview.data.description = this.wsdata.savedContent
            if (this.mode === 'add' && isValid) {
                await this.createReview()
            } else if (this.mode === 'edit' && isValid) {
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

            this.closeDrawerNoConfirm()
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
                await this.$store.dispatch('projects/lockUnlockProject', {
                    project_id: this.projectId,
                    context: this.lock ? 'lock' : 'unlock',
                })

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
                reviewer_id: this.newReview.data.reviewer.id,
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

        closeDrawer() {
            if (this.wsdata.originalContent !== this.wsdata.savedContent) this.openConfirmModal()
            else this.closeDrawerNoConfirm()
        },

        closeDrawerNoConfirm() {
            this.$emit('close')
        },

        closeModalAndDrawer() {
            this.openConfirmModal()
            this.closeDrawerNoConfirm()
        },

        openConfirmModal() {
            this.showConfirmModal = !this.showConfirmModal
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
    text-align: left;
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

.error-description {
    color: $salmon-dark;
    margin-top: $space-s;
    font-family: Ubuntu, 'Noto Sans SC', helvetica, arial, sans-serif;
    font-size: $font-size-s;
}
</style>
