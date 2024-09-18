<template>
    <div class="instruction-list-page page-section-medium page-top">
        <h1 class="page-title">{{ $t('instructions.list.title') }}</h1>

        <div class="create-instruction-button-ctn">
            <LpiButton
                v-if="canCreateInstruction"
                primary
                :label="$filters.capitalize($t('instructions.list.create'))"
                @click="createInstruction"
                data-test="create-instruction-button"
                btn-icon="Plus"
                class="create-instruction-button"
            />
        </div>
        <div class="instruction-list" v-if="loading">
            <InstructionListItemSkeleton />
            <InstructionListItemSkeleton />
        </div>
        <div v-else class="instruction-list">
            <InstructionListItem
                :instruction="instruction"
                v-for="instruction in allInstructions"
                :key="instruction.id"
                @edit-instruction="editedInstruction = instruction"
                @delete-instruction="instructionToDelete = instruction"
            />
        </div>
    </div>
    <EditInstructionDrawer
        :is-opened="!!editedInstruction"
        :instruction="editedInstruction"
        @close="editedInstruction = null"
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
import LpiButton from '@/components/base/button/LpiButton.vue'
import InstructionListItemSkeleton from '@//components/instruction/InstructionListItem/InstructionListItemSkeleton.vue'
import InstructionListItem from '@/components/instruction/InstructionListItem/InstructionListItem.vue'
import EditInstructionDrawer from '@/components/instruction/EditInstructionDrawer/EditInstructionDrawer.vue'
import ConfirmModal from '@/components/base/modal/ConfirmModal.vue'
import permissions from '@/mixins/permissions.ts'
import { getAllInstructions, deleteInstruction } from '@/api/instruction.service'
import useToasterStore from '@/stores/useToaster.ts'

export default {
    name: 'InstructionListPage',
    components: {
        LpiButton,
        InstructionListItem,
        EditInstructionDrawer,
        ConfirmModal,
        InstructionListItemSkeleton,
    },

    mixins: [permissions],
    setup() {
        const toaster = useToasterStore()
        return {
            toaster,
        }
    },

    data() {
        return {
            allInstructions: [],
            loading: false,
            editedInstruction: null,
            instructionToDelete: null,
            isDeletingInstruction: false,
        }
    },

    mounted() {
        this.loadInstructions()
    },

    methods: {
        createInstruction() {
            this.$router.push({ name: 'CreateInstructionPage' })
        },

        async loadInstructions() {
            const dateLimit =
                this.canEditInstruction || this.canDeleteInstruction
                    ? {}
                    : { to_date: new Date().toISOString() }
            this.loading = true
            this.allInstructions = (
                await getAllInstructions(this.$store.getters['organizations/current']?.code, {
                    ordering: 'publication_date',
                    ...dateLimit,
                })
            ).results
            this.loading = false
        },

        async deleteInstruction() {
            this.isDeletingInstruction = true
            try {
                await deleteInstruction(
                    this.$store.getters['organizations/current']?.code,
                    this.instructionToDelete.id
                )
                this.toaster.pushSuccess(this.$t('instructions.delete.success'))

                this.loadInstructions()
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
<style lang="scss" scoped>
.page-title {
    margin-bottom: $space-2xl;
}

.create-instruction-button-ctn {
    margin: 2rem 0;
}

.create-instruction-button {
    margin-left: auto;
}

.loader-ctn {
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 5rem 0;
}

.instruction-list {
    display: flex;
    flex-direction: column;
    gap: 2rem;
    margin-bottom: 4rem;
}
</style>
