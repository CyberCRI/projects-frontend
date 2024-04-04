<template>
    <BaseListSummaryBlock
        :title="
            instructions.length > 2
                ? $t(`home.short-title.instructions`)
                : $t(`home.long-title.instructions`)
        "
        :items="instructions"
        :inlined="inlined"
    >
        <template #default>
            <InstructionItem
                v-for="instruction in instructions"
                :key="instruction.id"
                :instruction="instruction"
                @edit-instruction="editedInstruction = instruction"
                @delete-instruction="instructionToDelete = instruction"
            />

            <EditInstructionDrawer
                :is-opened="!!editedInstruction"
                :instruction="editedInstruction"
                @close="editedInstruction = null"
            />

            <ConfirmModal
                v-if="instructionToDelete"
                :content="$t('instructions.delete.message')"
                :title="$t('instructions.delete.title')"
                cancel-button-label="common.cancel"
                confirm-button-label="common.delete"
                @cancel="instructionToDelete = null"
                @confirm="deleteInstruction"
                :asyncing="isDeletingInstruction"
            />
        </template>

        <template #action>
            <SummaryAction
                :to="{ name: 'InstructionListPage' }"
                action-icon="ArrowRight"
                :action-label="$t('feed.see-all')"
            />
        </template>
    </BaseListSummaryBlock>
</template>

<script>
import InstructionItem from '@/components/lpikit/SummaryCards/InstructionItem.vue'
import BaseListSummaryBlock from '@/components/lpikit/SummaryCards/BaseListSummaryBlock.vue'
import SummaryAction from '@/components/lpikit/SummaryCards/SummaryAction.vue'
import EditInstructionDrawer from '@/components/lpikit/EditInstructionDrawer/EditInstructionDrawer.vue'
import ConfirmModal from '@/components/lpikit/ConfirmModal/ConfirmModal.vue'

export default {
    name: 'InstructionSummaryBlock',

    components: {
        InstructionItem,
        BaseListSummaryBlock,
        SummaryAction,
        EditInstructionDrawer,
        ConfirmModal,
    },

    props: {
        instructions: {
            type: Array,
            default: () => [],
        },
        inlined: {
            type: Boolean,
            default: false,
        },
    },

    data() {
        return {
            editedInstruction: null,
            instructionToDelete: null,
            isDeletingInstruction: false,
        }
    },

    methods: {
        async deleteInstruction() {
            // TODO: delete intstuction
            console.log('delete instruction', this.instructionToDelete)
            this.isDeletingInstruction = true
            try {
                await new Promise((resolve) => setTimeout(resolve, 1000)) // Simulate API call her
                this.$store.dispatch('notifications/pushToast', {
                    message: this.$t('instructions.delete.success'),
                    type: 'success',
                })
            } catch (err) {
                this.$store.dispatch('notifications/pushToast', {
                    message: `${this.$t('instructions.delete.error')} (${err})`,
                    type: 'error',
                })
                console.error(err)
            } finally {
                this.instructionToDelete = null
                this.isDeletingInstruction = false
            }
        },
    },
}
</script>
