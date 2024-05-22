<template>
    <BaseDrawer
        :confirm-action-name="$t('common.save')"
        :confirm-action-disabled="asyncing"
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
    </BaseDrawer>
</template>

<script>
import TipTapEditor from '@/components/base/form/TextEditor/TipTapEditor.vue'
import BaseDrawer from '@/components/base/BaseDrawer.vue'
import TextInput from '@/components/base/form/TextInput.vue'
import { patchOrganization } from '@/api/organizations.service.ts'

export default {
    name: 'OrgWordingDrawer',

    emits: ['close', 'organization-edited'],

    components: {
        TipTapEditor,
        BaseDrawer,
        TextInput,
    },

    props: {
        isOpened: {
            type: Boolean,
            default: false,
        },
    },

    data() {
        const org = this.$store.getters['organizations/current']
        const title = org?.dashboard_title || ''
        const description = org?.description || ''

        return {
            editorKey: 0,
            title: title,
            description: {
                savedContent: description,
                originalContent: description,
            },
            addedImages: [],
            asyncing: false,
        }
    },
    watch: {
        isOpened() {
            const org = this.$store.getters['organizations/current']
            const description = org?.description || ''
            this.description.savedContent = description
            this.description.originalContent = description
        },
    },

    methods: {
        async saveWording() {
            this.asyncing = true

            try {
                const payload = {
                    dashboard_title: this.title,
                    description: this.description.savedContent,
                }

                await patchOrganization(this.$store.getters['organizations/current']?.code, payload)
                this.$emit('organization-edited')
                this.$store.dispatch('notifications/pushToast', {
                    message: this.$t('admin.portal.general.wording.success'),
                    type: 'success',
                })
            } catch (err) {
                this.$store.dispatch('notifications/pushToast', {
                    message: `${this.$t('admin.portal.general.wording.error')} (${err})`,
                    type: 'error',
                })
                console.error(err)
            } finally {
                this.asyncing = false
                this.$emit('close')
            }
        },

        close() {
            this.$emit('close')
        },

        updateContent(htmlContent) {
            this.description.savedContent = htmlContent
            if (htmlContent === '<p></p>') this.description.savedContent = ''
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
