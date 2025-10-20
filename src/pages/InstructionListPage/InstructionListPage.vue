<script setup>
import { getAllInstructions, deleteInstruction } from '@/api/instruction.service'
import useToasterStore from '@/stores/useToaster.ts'
import useOrganizationsStore from '@/stores/useOrganizations.ts'
import { getOrganizationByCode } from '@/api/organizations.service'
import { capitalize } from 'es-toolkit'

const { translateInstructions } = useAutoTranslate()
const toaster = useToasterStore()
const organizationsStore = useOrganizationsStore()
const { canCreateInstruction, canEditInstruction, canDeleteInstruction } = usePermissions()
const router = useRouter()
const { t } = useI18n()

const _allInstructions = useState(() => [])
const allInstructions = translateInstructions(_allInstructions)

const loading = ref(false)
const editedInstruction = ref(null)
const instructionToDelete = ref(null)
const isDeletingInstruction = ref(false)

const createInstruction = () => {
  router.push({ name: 'CreateInstructionPage' })
}

const loadInstructions = async () => {
  const dateLimit =
    canEditInstruction.value || canDeleteInstruction.value
      ? {}
      : { to_date: new Date().toISOString() }
  loading.value = true
  _allInstructions.value = (
    await getAllInstructions(organizationsStore.current?.code, {
      ordering: '-publication_date',
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
  const { image, dimensions } = useImageAndDimension(organization?.banner_image, 'medium')
  useLpiHead(
    useRequestURL().toString(),
    computed(() => t('instructions.list.title')),
    organization?.dashboard_subtitle,
    image,
    dimensions
  )
} catch (err) {
  // DGAF
  console.log(err)
}
</script>

<template>
  <div class="instruction-list-page page-section-medium page-top">
    <h1 class="page-title">
      {{ $t('instructions.list.title') }}
    </h1>

    <div class="create-instruction-button-ctn">
      <LpiButton
        v-if="canCreateInstruction"
        primary
        :label="capitalize($t('instructions.list.create'))"
        data-test="create-instruction-button"
        btn-icon="Plus"
        class="create-instruction-button"
        @click="createInstruction"
      />
    </div>
    <div v-if="loading" class="instruction-list">
      <InstructionListItemSkeleton />
      <InstructionListItemSkeleton />
    </div>
    <div v-else class="instruction-list">
      <InstructionListItem
        v-for="instruction in allInstructions"
        :key="instruction.id"
        :instruction="instruction"
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
    :asyncing="isDeletingInstruction"
    @cancel="instructionToDelete = null"
    @confirm="doDeleteInstruction"
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
