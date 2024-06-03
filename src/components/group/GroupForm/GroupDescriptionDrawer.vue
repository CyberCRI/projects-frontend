<template>
    <BaseDrawer
        :confirm-action-name="$t('common.save')"
        :confirm-action-disabled="v$.$invalid"
        :is-opened="isOpened"
        :title="$t('group.form.add-description')"
        class="group-drawer"
        @close="close"
        @confirm="saveDescription"
    >
        <ConfirmModal
            v-if="confirmModalIsOpen"
            content=""
            :title="$t('description.quit-without-saving-title')"
            confirm-button-label="common.continue"
            @cancel="confirmModalIsOpen = false"
            @confirm="closeDrawer"
        />

        <div class="editor-ctn">
            <TipTapEditor
                v-if="wsData"
                :key="editorKey"
                ref="tiptapEditor"
                :socket="false && !isAddMode"
                :ws-data="wsData"
                class="input-field content-editor no-max-height min-height-100"
                mode="medium"
                parent="group-entry"
                @destroy="closeDrawer"
                @image="handleImage"
                @update="updateContent"
            />
        </div>
    </BaseDrawer>
</template>

<script>
import TipTapEditor from '@/components/base/form/TextEditor/TipTapEditor.vue'
import BaseDrawer from '@/components/base/BaseDrawer.vue'
import permissions from '@/mixins/permissions.ts'
import useVuelidate from '@vuelidate/core'
import ConfirmModal from '@/components/base/modal/ConfirmModal.vue'

export default {
    name: 'GroupDescriptionDrawer',

    emits: ['close', 'update-description'],

    mixins: [permissions],

    components: {
        TipTapEditor,
        BaseDrawer,
        ConfirmModal,
    },

    props: {
        isOpened: {
            type: Boolean,
            default: false,
        },
        // TODO this set the socket status
        // witch is forced to false for now
        // uintil the server is updated
        isAddMode: {
            type: Boolean,
            default: true,
        },

        originalDescription: {
            type: String,
            default: null,
        },
    },

    data() {
        return {
            v$: useVuelidate(),
            wsData: {
                room: null, // TODO: set to something when socket is enabled and we are in add mode
                savedContent: '',
                originalContent: '',
            },
            addedImages: [],
            editorKey: 0,
            confirmModalIsOpen: false,
        }
    },

    watch: {
        isOpened: {
            handler: function (neo) {
                if (neo) {
                    this.wsData.originalContent = this.originalDescription
                }
                this.$nextTick(() => {
                    this.forceRerender()
                    if (this.v$) this.v$.$reset()
                })
            },
            immediate: true,
        },
    },

    methods: {
        closeDrawer() {
            this.confirmModalIsOpen = false
            this.v$.$reset()
            this.$emit('close')
            this.forceRerender()
        },

        updateContent(htmlContent) {
            this.wsData.savedContent = htmlContent

            if (htmlContent === '<p></p>') this.wsData.savedContent = null
        },

        saveDescription() {
            this.$emit('update-description', this.wsData.savedContent)
            this.close()
        },

        handleImage(img) {
            this.addedImages.push(img.id)
        },

        forceRerender() {
            this.editorKey += 1
        },
        close() {
            this.$emit('close')
        },
    },
}
</script>

<style lang="scss" scoped>
.group-drawer {
    height: 100%;

    .input-field {
        margin: $space-l;
        margin-bottom: $space-xs;
    }

    .content-editor {
        flex-grow: 1;
        min-height: pxToRem(300px);
    }
}

.editor-ctn {
    flex-grow: 1;
    display: flex;
    flex-flow: column;
    justify-content: stretch;
}

.error-description {
    color: $red;
    font-size: $font-size-s;
    margin-left: $space-l;
}
</style>
