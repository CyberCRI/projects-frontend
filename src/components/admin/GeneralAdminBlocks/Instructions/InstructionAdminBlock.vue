<template>
    <AdminBlock :block-title="blockTitle" :is-loading="isLoading">
        <template #default>
            <InstructionAdminListItem
                v-for="instruction in diplayableInstructions"
                :key="instruction.id"
                :instruction="instruction"
                @edit-instruction="onEditInstruction"
                @delete-instruction="onDeleteInstruction"
            ></InstructionAdminListItem>
        </template>

        <template #footer
            ><SummaryAction
                action-icon="Plus"
                :action-label="$t('common.add')"
                @click="addInstruction"
            />
            <SummaryAction
                btn-icon="ArrowRight"
                :action-label="$t('common.see-all')"
                :to="{ name: 'InstructionListPage' }"
            />
        </template>
    </AdminBlock>
    <EditInstructionDrawer
        :is-opened="!!editedInstruction"
        @close="editedInstruction = null"
        :instruction="editedInstruction"
        @instruction-edited="loadInstructions"
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
<script>
import AdminBlock from '../AdminBlock.vue'
import EditInstructionDrawer from '@/components/instruction/EditInstructionDrawer/EditInstructionDrawer.vue'
import ConfirmModal from '@/components/base/modal/ConfirmModal.vue'
import { defaultForm } from '@/components/instruction/InstructionForm/InstructionForm.vue'
import InstructionAdminListItem from './InstructionAdminListItem.vue'
import { getAllInstructions, deleteInstruction } from '@/api/instruction.service'
import SummaryAction from '@/components/home/SummaryCards/SummaryAction.vue'

export default {
    name: 'InstructionAdminBlock',

    components: {
        AdminBlock,
        EditInstructionDrawer,
        InstructionAdminListItem,
        ConfirmModal,
        SummaryAction,
    },

    data() {
        return {
            instructions: [],
            instructionsCount: 0,
            isLoading: true,
            editedInstruction: null,
            instructionToDelete: null,
        }
    },

    computed: {
        blockTitle() {
            let extra = this.isLoading ? '' : ` (${this.instructionsCount})`
            return this.$t('admin.portal.instructions') + extra
        },

        diplayableInstructions() {
            return this.instructions.slice(0, 1)
        },
    },

    async mounted() {
        await this.loadInstructions()
    },

    methods: {
        async loadInstructions() {
            this.isLoading = true
            const request = await getAllInstructions(
                this.$store.getters['organizations/current']?.code,
                {
                    ordering: '-publication_date',
                    limit: 1,
                }
            )
            this.instructions = request.results
            this.instructionsCount = request.count
            this.isLoading = false
        },

        addInstruction() {
            this.editedInstruction = defaultForm()
        },

        onEditInstruction(instruction) {
            this.editedInstruction = instruction
        },

        onDeleteInstruction(instruction) {
            this.instructionToDelete = instruction
        },

        async deleteInstruction() {
            this.isDeletingInstruction = true
            try {
                await deleteInstruction(
                    this.$store.getters['organizations/current']?.code,
                    this.instructionToDelete.id
                )
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
                this.$router.push({ name: 'InstructionListPage' })
            }
        },
    },
}
</script>
