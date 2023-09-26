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
                />

                <div class="buttons-ctn">
                    <LpiButton
                        v-if="!isAddMode"
                        :label="$filters.capitalize($t('common.delete'))"
                        :left-icon="deleteLoading ? 'LoaderSimple' : null"
                        class="delete-button"
                        color="salmon"
                        @click="showDeleteConfirm"
                    />

                    <LpiButton
                        :disabled="!faqTitle"
                        :label="
                            $filters.capitalize(isAddMode ? $t('common.add') : $t('common.edit'))
                        "
                        :left-icon="addOrEditLoading ? 'LoaderSimple' : null"
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
import TextInput from '@/components/lpikit/TextInput/TextInput.vue'
import TipTapEditor from '@/components/lpikit/TextEditor/TipTapEditor.vue'
import LpiSnackbar from '@/components/lpikit/Snackbar/LpiSnackbar.vue'
import LpiButton from '@/components/lpikit/LpiButton/LpiButton.vue'
import ConfirmModal from '@/components/lpikit/ConfirmModal/ConfirmModal.vue'

export default {
    name: 'HelpTab',

    components: { TipTapEditor, TextInput, LpiSnackbar, LpiButton, ConfirmModal },

    data() {
        return {
            addedImages: [],
            addOrEditLoading: false,
            deleteLoading: false,
            deleteConfirmVisible: false,
            editorKey: 0,
        }
    },

    created() {
        this.$store.dispatch('faqs/getFaq', this.currentOrgCode)
    },

    computed: {
        currentOrgCode() {
            return this.$store.getters['organizations/current'].code
        },

        faq() {
            return this.$store.getters['faqs/current']
        },

        faqTitle: {
            get() {
                return this.faq ? this.faq.title : ''
            },
            set(value) {
                this.$store.dispatch('faqs/updateFaqTitle', value)
            },
        },

        faqContent() {
            return { originalContent: this.faq ? this.faq.content : '' }
        },

        isAddMode() {
            return (
                this.$store.getters['faqs/current'] === null ||
                this.$store.getters['faqs/current'].id === undefined
            )
        },
    },

    methods: {
        async deleteFaq() {
            this.hideConfirmModal()
            this.deleteLoading = true

            try {
                await this.$store.dispatch('faqs/deleteFaq', {
                    orgCode: this.currentOrgCode,
                })
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
                    await this.$store.dispatch('faqs/createFaq', {
                        ...this.faq,
                        organization_code: this.currentOrgCode,
                        images_ids: this.addedImages,
                    })
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
                    await this.$store.dispatch('faqs/updateFaq', {
                        ...this.faq,
                        organization_code: this.currentOrgCode,
                        images_ids: this.addedImages,
                    })
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
            this.$store.dispatch('faqs/updateFaqContent', htmlContent)

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
    padding: $space-xl $space-l;

    .block-container {
        background: $white;
        border-radius: $border-radius-l;
        border: $space-l solid $white;
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
            line-height: $font-size-l;
        }

        .input-ctn {
            text-align: start;
            margin-bottom: $space-l;
        }
    }
}
</style>
