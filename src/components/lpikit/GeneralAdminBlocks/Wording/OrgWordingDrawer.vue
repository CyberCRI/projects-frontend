<template>
    <DrawerLayout
        :confirm-action-name="$t('common.save')"
        :confirm-action-disabled="false"
        :is-opened="isOpened"
        :title="$t('admin.portal.general.wording.title')"
        class="wording-drawer medium"
        @close="close"
        @confirm="saveWording"
    >
        <div>
            <TextInput
                v-model="title"
                :label="$t('admin.portal.general.wording.fields.title')"
                :placeholder="$t('admin.portal.general.wording.fields.title-placeholder')"
                class="input-field"
            />
        </div>

        <div class="editor-section">
            <h4 class="field-label">
                {{ $t('admin.portal.general.wording.fields.description') }}
            </h4>
            <TipTapEditor
                :key="editorKey"
                ref="tiptapEditor"
                :socket="false"
                :ws-data="description"
                class="input-field content-editor"
                mode="full"
                @destroy="close"
                @image="handleImage"
                @saved="submitBlogEntry(false)"
                @update="updateContent"
            />
        </div>
    </DrawerLayout>
</template>

<script>
import TipTapEditor from '@/components/lpikit/TextEditor/TipTapEditor.vue'
import DrawerLayout from '@/components/lpikit/Drawer/DrawerLayout.vue'
import TextInput from '@/components/lpikit/TextInput/TextInput.vue'

export default {
    name: 'OrgWordingDrawer',

    emits: ['close'],

    components: {
        TipTapEditor,
        DrawerLayout,
        TextInput,
    },

    props: {
        isOpened: {
            type: Boolean,
            default: false,
        },
    },

    data() {
        return {
            editorKey: 0,
            title: '',
            description: {
                savedContent: '',
                originalContent: '',
            },
            addedImages: [],
        }
    },

    methods: {
        saveWording() {
            // TODO Save wording
            this.$emit('close')
        },

        close() {
            this.$emit('close')
        },

        updateContent(htmlContent) {
            this.description.savedContent = htmlContent
            if (htmlContent === '<p></p>') this.description.savedContent = null
        },

        handleImage(img) {
            // TODO see BlogDrawer
            this.addedImages.push(img.id)
        },
    },
}
</script>
<style lang="scss" scoped>
.field-label {
    font-size: $font-size-s;
    margin-top: $space-l;
    margin-bottom: $space-m;
}
</style>
