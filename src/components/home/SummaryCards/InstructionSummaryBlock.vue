<template>
    <BaseListSummaryBlock
        :title="$t(`home.short-title.instructions`)"
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
                @instruction-edited="$emit('reload-instructions')"
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
import InstructionItem from '@/components/home/SummaryCards/InstructionItem.vue'
import BaseListSummaryBlock from '@/components/home/SummaryCards/BaseListSummaryBlock.vue'
import SummaryAction from '@/components/home/SummaryCards/SummaryAction.vue'
import EditInstructionDrawer from '@/components/instruction/EditInstructionDrawer/EditInstructionDrawer.vue'
import ConfirmModal from '@/components/base/modal/ConfirmModal.vue'
import { deleteInstruction } from '@/api/instruction.service'
import useToasterStore from '@/stores/useToaster.ts'
import useOrganizationsStore from '@/stores/useOrganizations.ts'

export default {
    name: 'InstructionSummaryBlock',

    emits: ['reload-instructions'],

    components: {
        InstructionItem,
        BaseListSummaryBlock,
        SummaryAction,
        EditInstructionDrawer,
        ConfirmModal,
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
                await deleteInstruction(
                    this.organizationsStore.current?.code,
                    this.instructionToDelete.id
                )
                this.toaster.pushSuccess(this.$t('instructions.delete.success'))

                this.$emit('reload-instructions')
            } catch (err) {
                this.toaster.pushError(`${this.$t('instructions.delete.error')} (${err})`)
                console.error(err)
            } finally {
                this.instructionToDelete = null
                this.isDeletingInstruction = false
            }
        },
    },
}
</script>
