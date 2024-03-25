<template>
    <AdminBlock :block-title="blockTitle" :is-loading="isLoading">
        <template #actions>
            <LinkButton
                v-if="hasChat"
                btn-icon="Pen"
                :label="$t('common.edit')"
                @click="editChatIsOpen = true"
            ></LinkButton>
            <LinkButton
                v-else
                btn-icon="Plus"
                :label="$t('common.add')"
                @click="editChatIsOpen = true"
            ></LinkButton>
        </template>
        <template #default v-if="hasChat">
            <p class="chat-data">
                <strong>{{ $t('chat.data.wording') }}</strong> {{ wording }}
            </p>
            <p class="chat-data">
                <strong>{{ $t('chat.data.link') }}</strong>
                <a target="_blank" :href="url">{{ url }}</a>
            </p>
        </template>
    </AdminBlock>
    <EditChatDrawer :is-opened="editChatIsOpen" @close="editChatIsOpen = false" :form="chatForm" />
</template>
<script>
import AdminBlock from '../AdminBlock.vue'
import LinkButton from '@/components/lpikit/LpiButton/LinkButton.vue'
import EditChatDrawer, {
    defaultForm,
} from '@/components/lpikit/GeneralAdminBlocks/Chat/EditChatDrawer.vue'
export default {
    name: 'ChatAdminBlock',

    components: {
        AdminBlock,
        LinkButton,
        EditChatDrawer,
    },

    data() {
        return {
            wording: 'Join chat',
            url: 'https://universitedeparis.slack.com',
            editChatIsOpen: false,
            chatForm: defaultForm(),
        }
    },

    computed: {
        blockTitle() {
            return this.$t('admin.portal.chat')
        },
        hasChat() {
            return !!this.url
        },
    },

    methods: {},
}
</script>
<style lang="scss" scoped>
.chat-data {
    & + .chat-data {
        margin-top: $space-m;
    }

    strong {
        font-weight: bold;
    }

    a {
        color: $primary-dark;
        text-decoration: underline;
    }
}
</style>
