<template>
    <div class="help-tab">
        <div class="block-container">
            <form onsubmit="return false;">
                <TextInput v-model="faqTitle" :label="$t('faq.tab')" />

                <label>{{ $t('form.description') }}</label>
                <TipTapEditor
                    :key="editorKey"
                    ref="faq-editor"
                    :ws-data="faqContent"
                    mode="full"
                    @update="updateContent"
                    :save-image-callback="saveFaqImage"
                />

                <div class="buttons-ctn">
                    <LpiButton
                        v-if="!isAddMode"
                        :label="$filters.capitalize($t('common.delete'))"
                        :btn-icon="deleteLoading ? 'LoaderSimple' : null"
                        class="delete-button"
                        @click="showDeleteConfirm"
                    />

                    <LpiButton
                        :disabled="!faqTitle"
                        :label="
                            $filters.capitalize(isAddMode ? $t('common.add') : $t('common.edit'))
                        "
                        :btn-icon="addOrEditLoading ? 'LoaderSimple' : null"
                        @click="submitFaq"
                    />
                </div>
            </form>
        </div>

        <div class="block-container snackbar-container">
            <LpiSnackbar icon="QuestionMark" type="info">
                <div v-html="$t('faq.info')"></div>
            </LpiSnackbar>
        </div>

        <ConfirmModal
            v-if="deleteConfirmVisible"
            :content="$t('faq.delete-confirm-content')"
            :title="$t('faq.delete-confirm-title')"
            @cancel="hideConfirmModal"
            @confirm="deleteFaq"
        />
    </div>
</template>

<script>
import TextInput from '@/components/base/form/TextInput.vue'
import TipTapEditor from '@/components/base/form/TextEditor/TipTapEditor.vue'
import LpiSnackbar from '@/components/base/LpiSnackbar.vue'
import LpiButton from '@/components/base/button/LpiButton.vue'
import ConfirmModal from '@/components/base/modal/ConfirmModal.vue'
import { getFaq, createFaq, putFaq, deleteFaq, postFaqImage } from '@/api/faqs.service'

function defaultFaq() {
    return {
        content: undefined,
        title: undefined,
        id: undefined,
        created_at: undefined,
        updated_at: undefined,
        deleted_at: undefined,
        images: undefined,
    }
}

export default {
    name: 'HelpAdminTab',

    components: { TipTapEditor, TextInput, LpiSnackbar, LpiButton, ConfirmModal },

    data() {
        return {
            addedImages: [],
            addOrEditLoading: false,
            deleteLoading: false,
            deleteConfirmVisible: false,
            editorKey: 0,
            faq: null,
        }
    },

    async created() {
        await this.loadFaq()
    },

    computed: {
        currentOrgCode() {
            return this.$store.getters['organizations/current'].code
        },

        faqTitle: {
            get() {
                return this.faq ? this.faq.title : ''
            },
            set(value) {
                if (this.faq) this.faq.title = value
            },
        },

        faqContent() {
            return { originalContent: this.faq ? this.faq.content : '' }
        },

        isAddMode() {
            return !this.faq || !this.faq.id
        },
    },

    methods: {
        saveFaqImage(file) {
            const formData = new FormData()
            formData.append('file', file, file.name)
            // formData.append('project_id', this.$store.getters['projects/currentProjectId'])
            return postFaqImage({
                orgCode: this.currentOrgCode,
                body: formData,
            })
        },

        async loadFaq() {
            try {
                this.faq = await getFaq(this.currentOrgCode)
            } catch (err) {
                console.log(err)
                this.faq = defaultFaq()
            }
        },
        async deleteFaq() {
            this.hideConfirmModal()
            this.deleteLoading = true

            try {
                await await deleteFaq({
                    orgCode: this.currentOrgCode,
                })
                await this.loadFaq()
                this.editorKey += 1
                this.$store.dispatch('notifications/pushToast', {
                    message: this.$t('toasts.faq-delete.success'),
                    type: 'success',
                })
            } catch (error) {
                this.$store.dispatch('notifications/pushToast', {
                    message: `${this.$t('toasts.faq-delete.error')} (${error})`,
                    type: 'error',
                })
                console.error(error)
            } finally {
                this.deleteLoading = false
            }
        },

        hideConfirmModal() {
            this.deleteConfirmVisible = false
        },

        showDeleteConfirm() {
            this.deleteConfirmVisible = true
        },

        async submitFaq() {
            this.addOrEditLoading = true
            if (this.isAddMode) {
                try {
                    await createFaq({
                        ...this.faq,
                        organization_code: this.currentOrgCode,
                        images_ids: this.addedImages,
                    })
                    await this.loadFaq()
                    this.$store.dispatch('notifications/pushToast', {
                        message: this.$t('toasts.faq-create.success'),
                        type: 'success',
                    })
                } catch (error) {
                    this.$store.dispatch('notifications/pushToast', {
                        message: `${this.$t('toasts.faq-create.error')} (${error})`,
                        type: 'error',
                    })
                    console.error(error)
                } finally {
                    this.addOrEditLoading = false
                }
            } else {
                try {
                    await putFaq({
                        ...this.faq,
                        organization_code: this.currentOrgCode,
                        images_ids: this.addedImages,
                    })

                    await this.loadFaq()
                    this.$store.dispatch('notifications/pushToast', {
                        message: this.$t('toasts.faq-update.success'),
                        type: 'success',
                    })
                } catch (error) {
                    this.$store.dispatch('notifications/pushToast', {
                        message: `${this.$t('toasts.faq-update.error')} (${error})`,
                        type: 'error',
                    })
                    console.error(error)
                } finally {
                    this.addOrEditLoading = false
                }
            }
        },

        updateContent(htmlContent) {
            const cursorPosition = this.$refs['faq-editor'].editor.view.state.selection.anchor
            if (this.faq) this.faq.content = htmlContent

            this.$nextTick(() => {
                // Store dispatch makes the editor lose focus,
                // this sets back focus and sets cursor where it was
                this.$refs['faq-editor'].editor.commands.focus()
                this.$refs['faq-editor'].editor.commands.setTextSelection(cursorPosition)
            })
        },
    },
}
</script>

<style lang="scss" scoped>
.help-tab {
    display: flex;
    flex-direction: column-reverse;
    padding: $space-xl 0;

    .block-container {
        background: $white;
        box-sizing: border-box;

        label {
            font-size: $font-size-s;
            color: $primary-dark;
            font-weight: bold;
            display: block;
            margin-bottom: $space-m;
        }

        .input-ctn {
            margin-bottom: $space-l;
            align-items: stretch;
            width: auto;
        }

        .buttons-ctn {
            display: flex;
            align-items: center;
            margin: $space-l auto 0;
            width: fit-content;

            .delete-button {
                margin-right: $space-m;
            }
        }

        &:first-of-type {
            width: 100%;
        }
    }

    .snackbar-container {
        margin-bottom: $space-l;
        display: flex;
        justify-content: center;
    }
}

@media (min-width: $min-desktop) {
    .help-tab {
        flex-direction: row;
        align-items: flex-start;

        .snackbar-container {
            width: 50%;
            text-align: start;
            margin-bottom: 0;
            margin-left: $space-l;
        }

        .input-ctn {
            text-align: start;
            margin-bottom: $space-l;
        }
    }
}
</style>
