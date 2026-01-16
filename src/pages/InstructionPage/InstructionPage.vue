<script setup lang="ts">
import { getInstruction, deleteInstruction } from '@/api/instruction.service'
import useToasterStore from '@/stores/useToaster'
import useOrganizationsStore from '@/stores/useOrganizations'
import { getOrganizationByCode } from '@/api/organizations.service'

const props = defineProps({
  slugOrId: {
    type: String,
    required: true,
  },
})

const { translateInstruction } = useAutoTranslate()

const { d, t } = useNuxtI18n()
const { canEditInstruction, canDeleteInstruction } = usePermissions()
const toaster = useToasterStore()
const organizationsStore = useOrganizationsStore()
const router = useRouter()
const route = useRoute()

const _instruction = useState(() => null)
const instruction = translateInstruction(_instruction)
const loading = ref(false)
const editedInstruction = ref(null)
const instructionToDelete = ref(null)
const isDeletingInstruction = ref(false)

const breadcrumbs = computed(() => {
  return [
    {
      name: 'Instructions',
      route: { name: 'InstructionListPage' },
    },
  ]
})

const publicationDate = computed(() => {
  return instruction.value?.publication_date ? d(new Date(instruction.value.publication_date)) : ''
})

const loadInstruction = async () => {
  loading.value = true
  // TODO: Fetch instuction
  try {
    _instruction.value = await getInstruction(organizationsStore.current?.code, props.slugOrId)

    loading.value = false
  } catch (err) {
    console.error(err)
    router.replace({
      name: 'page404',
      params: { pathMatch: route.path.substring(1).split('/') },
    })
  }
}

const doDeleteInstruction = async () => {
  isDeletingInstruction.value = true
  try {
    await deleteInstruction(organizationsStore.current?.code, instructionToDelete.value.id)
    toaster.pushSuccess(t('instructions.delete.success'))
  } catch (err) {
    toaster.pushError(`${t('instructions.delete.error')} (${err})`)
    console.error(err)
  } finally {
    instructionToDelete.value = null
    isDeletingInstruction.value = false
    router.push({ name: 'InstructionListPage' })
  }
}

onMounted(() => {
  loadInstruction()
})

try {
  const runtimeConfig = useRuntimeConfig()
  const organization = await getOrganizationByCode(runtimeConfig.public.appApiOrgCode)
  const inst = await getInstruction(runtimeConfig.public.appApiOrgCode, props.slugOrId, true)
  const { image, dimensions } = useImageAndDimension(organization?.banner_image, 'medium')

  useLpiHead(
    useRequestURL().toString(),
    inst.title,
    inst.content
      ?.replace(/<[^>]+>/gi, ' ')
      .replace(/\s+/gi, ' ')
      .substring(0, 300),
    image,
    dimensions
  )
} catch (err) {
  // DGAF
  console.log(err)
}
</script>
<template>
  <div class="instruction-list-page page-section-medium">
    <div class="instruction-header">
      <BreadCrumbs :breadcrumbs="breadcrumbs" />
      <div
        v-if="instruction && (canEditInstruction || canDeleteInstruction)"
        class="intruction-actions"
      >
        <ContextActionButton
          v-if="canEditInstruction"
          action-icon="Pen"
          class="edit-btn small"
          @click="editedInstruction = instruction"
        />
        <ContextActionButton
          v-if="canDeleteInstruction"
          action-icon="Close"
          class="remove-btn small"
          @click="instructionToDelete = instruction"
        />
      </div>

      <SkeletonComponent
        v-if="loading"
        tag="h1"
        class="page-title centered-skeleton"
        height="24px"
        width="50%"
      />
      <h1 v-else-if="instruction" class="page-title">
        {{ instruction?.$t?.title }}
      </h1>
      <SkeletonComponent
        v-if="loading"
        tag="p"
        class="publication-date centered-skeleton"
        height="16px"
        width="100px"
      />
      <p v-else-if="instruction" class="publication-date">
        {{ publicationDate }}
      </p>
    </div>
  </div>
  <div v-if="loading" class="page-section-narrow">
    <SkeletonComponent class="text-skeleton" height="16px" />
    <SkeletonComponent class="text-skeleton" height="16px" />
    <SkeletonComponent class="text-skeleton" height="16px" />
  </div>
  <div v-else-if="instruction" class="page-section-narrow">
    <TipTapOutput class="instruction-content" :content="instruction?.$t?.content" />
  </div>
  <EditInstructionDrawer
    :is-opened="!!editedInstruction"
    :instruction="editedInstruction"
    @close="editedInstruction = null"
    @instruction-edited="loadInstruction"
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
.instruction-header {
  margin-top: 70px;
  margin-bottom: 3rem;
}

.page-title {
  font-size: $font-size-3xl;
  margin-bottom: 1rem;
}

.publication-date {
  text-align: center;
}

.instruction-content {
  margin-bottom: 4rem;
}

.intruction-actions {
  display: flex;
  gap: $space-s;
  justify-content: flex-end;
}

.text-skeleton {
  margin-bottom: 1rem;
}

.centered-skeleton {
  margin-left: auto;
  margin-right: auto;
}
</style>
