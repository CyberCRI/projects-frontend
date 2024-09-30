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
                ref="tiptapEditor"
                v-model="description"
                :save-image-callback="saveOrganizationImage"
                class="input-field content-editor"
                mode="full"
                @image="handleImage"
            />
        </div>
    </BaseDrawer>
</template>

<script>
import TipTapEditor from '@/components/base/form/TextEditor/TipTapEditor.vue'
import BaseDrawer from '@/components/base/BaseDrawer.vue'
import TextInput from '@/components/base/form/TextInput.vue'
import { patchOrganization, postOrganizationImage } from '@/api/organizations.service.ts'
import useToasterStore from '@/stores/useToaster.ts'
import useOrganizationsStore from '@/stores/useOrganizations.ts'
export default {
    name: 'OrgWordingDrawer',

    emits: ['close', 'organization-edited'],

    components: {
        TipTapEditor,
        BaseDrawer,
        TextInput,
    },
    setup() {
        const toaster = useToasterStore()
        const organizationsStore = useOrganizationsStore()
        return {
            toaster,
            organizationsStore,
        }
    },

    props: {
        isOpened: {
            type: Boolean,
            default: false,
        },
    },

    data() {
        const org = this.organizationsStore.current
        const title = org?.dashboard_title || ''

        return {
            title: title,
            description: org?.description || '<p></p>',
            addedImages: [],
            asyncing: false,
        }
    },

    computed: {
        organization() {
            return this.organizationsStore.current
        },
    },

    watch: {
        isOpened() {
            const org = this.organization
            this.description = org?.description || '<p></p>'
        },
    },

    methods: {
        saveOrganizationImage(file) {
            const formData = new FormData()
            formData.append('file', file, file.name)
            return postOrganizationImage({
                orgCode: this.organization.code,
                body: formData,
            })
        },

        async saveWording() {
            this.asyncing = true

            try {
                const payload = {
                    dashboard_title: this.title,
                    description: this.description,
                }

                await patchOrganization(this.organizationsStore.current?.code, payload)
                this.$emit('organization-edited')
                this.toaster.pushSuccess(this.$t('admin.portal.general.wording.success'))
            } catch (err) {
                this.toaster.pushError(`${this.$t('admin.portal.general.wording.error')} (${err})`)
                console.error(err)
            } finally {
                this.asyncing = false
                this.$emit('close')
            }
        },

        close() {
            this.$emit('close')
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
