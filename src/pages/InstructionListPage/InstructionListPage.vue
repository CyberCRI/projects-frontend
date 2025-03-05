<script setup>
import { getAllInstructions, deleteInstruction } from '@/api/instruction.service'
import useToasterStore from '@/stores/useToaster.ts'
import useOrganizationsStore from '@/stores/useOrganizations.ts'
import { getOrganizationByCode } from '@/api/organizations.service'

const toaster = useToasterStore()
const organizationsStore = useOrganizationsStore()
const { canCreateInstruction, canEditInstruction, canDeleteInstruction } = usePermissions()
const router = useRouter()
const { t } = useI18n()

const allInstructions = useState(() => [])
const loading = useState(() => false)
const editedInstruction = useState(() => null)
const instructionToDelete = useState(() => null)
const isDeletingInstruction = () => false

const createInstruction = () => {
    router.push({ name: 'CreateInstructionPage' })
}

const loadInstructions = async () => {
    const dateLimit =
        canEditInstruction.value || canDeleteInstruction.value
            ? {}
            : { to_date: new Date().toISOString() }
    loading.value = true
    allInstructions.value = (
        await getAllInstructions(organizationsStore.current?.code, {
            ordering: 'publication_date',
            ...dateLimit,
        })
    ).results
    loading.value = false
}

const doDeleteInstruction = async () => {
    isDeletingInstruction.value = true
    try {
        await deleteInstruction(organizationsStore.current?.code, instructionToDelete.value.id)
        toaster.pushSuccess(t('instructions.delete.success'))

        loadInstructions()
    } catch (err) {
        toaster.pushError(`${t('instructions.delete.error')} (${err})`)
        console.error(err)
    } finally {
        instructionToDelete.value = null
        isDeletingInstruction.value = false
    }
}

onMounted(() => {
    loadInstructions()
})

try {
    const runtimeConfig = useRuntimeConfig()
    const organization = await getOrganizationByCode(runtimeConfig.public.appApiOrgCode)

    useLpiHead(
        useRequestURL().toString(),
        computed(() => t('instructions.list.title')),
        organization?.dashboard_subtitle,
        organization?.banner_image?.variations?.medium
    )
} catch (err) {
    // DGAF
    console.log(err)
}
</script>

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
        @confirm="doDeleteInstruction"
        :asyncing="isDeletingInstruction"
    />
</template>
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
