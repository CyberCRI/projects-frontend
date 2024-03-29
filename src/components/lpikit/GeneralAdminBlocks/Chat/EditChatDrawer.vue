<template>
    <DrawerLayout
        :confirm-action-name="$t('common.save')"
        :confirm-action-disabled="form?.v$?.$invalid"
        :is-opened="isOpened"
        :title="$t('chat.drawer.title')"
        class="chat-drawer small"
        @confirm="saveChat"
        @close="cancel"
    >
        <form>
            <p class="notice">{{ $t('chat.drawer.notice') }}</p>

            <div class="form-section">
                <label class="label">{{ $t('chat.drawer.url.label') }}</label>
                <p class="notice">{{ $t('chat.drawer.url.notice') }}</p>
                <TextInput v-model="form.url" :placeholder="$t('chat.drawer.url.placeholder')" />
            </div>

            <div class="form-section">
                <label class="label">{{ $t('chat.drawer.wording.label') }}</label>
                <p class="notice">{{ $t('chat.drawer.wording.notice') }}</p>
                <TextInput
                    v-model="form.url"
                    :placeholder="$t('chat.drawer.wording.placeholder')"
                />
            </div>
        </form>
    </DrawerLayout>
</template>
<script>
export function defaultForm() {
    return {
        url: '',
        wording: '',
    }
}

import DrawerLayout from '@/components/lpikit/Drawer/DrawerLayout.vue'
import TextInput from '@/components/lpikit/TextInput/TextInput.vue'

export default {
    name: 'EditChatDrawer',

    emits: ['close'],

    components: {
        DrawerLayout,
        TextInput,
    },

    props: {
        isOpened: {
            type: Boolean,
            required: true,
        },
    },

    data() {
        return {
            form: defaultForm(),
            asyncing: false,
        }
    },

    methods: {
        cancel() {
            this.$emit('close')
        },
        async saveChat() {
            const isValid = await this.$refs.newsForm.v$.$validate()
            if (!isValid) {
                return
            }
            this.asyncing = true
            // TODO handle image
            const formData = {
                ...this.form,
            }
            await new Promise((resolve) => setTimeout(resolve, 1000))
            console.log('saveChat', formData)
            this.asyncing = false
            this.$emit('close')
        },
    },
}
</script>
<style lang="scss" scoped>
.notice,
.label {
    display: block;
    padding-bottom: $space-m;
    line-height: 1.3;
}

.form-section {
    padding-bottom: $space-l;
}
</style>
