<script setup lang="ts">
import type { InstructionId } from '~/models/instruction.model'

import { getInstruction } from '~/api/v2/instruction.service'
import { deleteInstruction } from '~/api/instruction.service'

import FetchLoader from '~/components/base/FetchLoader.vue'

import useToasterStore from '~/stores/useToaster'

import { instructionSkeleton } from '~/skeletons/instructions.skeletons'
import { html2Text } from '~/functs/string'
import { formatDate } from '~/functs/date'

const props = defineProps<{
  slugOrId: InstructionId
}>()

const { t, locale } = useNuxtI18n()
const { canEditInstruction, canDeleteInstruction } = usePermissions()
const toaster = useToasterStore()
const router = useRouter()

const editedInstruction = ref(null)
const instructionToDelete = ref(null)
const isDeletingInstruction = ref(false)

const breadcrumbs = computed(() => [
  {
    name: t('home.instructions'),
    route: { name: 'InstructionListPage' },
  },
])

const organizationCode = useOrganizationCode()
const instructionId = computed(() => props.slugOrId)
const {
  status,
  data: instruction,
  error,
  refresh,
} = getInstruction(organizationCode, instructionId, {
  default: () => instructionSkeleton(),
})

const publicationDate = computed(() => {
  if (!instruction.value?.publication_date) {
    return ''
  }
  return formatDate(instruction.value.publication_date, locale.value)
})

const doDeleteInstruction = async () => {
  isDeletingInstruction.value = true
  try {
    await deleteInstruction(organizationCode, instructionToDelete.value.id)
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

watchEffect(() => {
  useLpiHead2({
    title: instruction.value?.$t.title,
    description: html2Text(instruction.value?.$t.content),
  })
})
</script>

<template>
  <FetchLoader :status="status" only-error skeleton :error="error" error404>
    <div class="instruction-list-page page-section-wide">
      <div class="instruction-header">
        <BreadCrumbs :breadcrumbs="breadcrumbs" />
        <div
          v-if="instruction && (canEditInstruction || canDeleteInstruction)"
          class="intruction-actions"
        >
          <ContextActionButton
            v-if="canEditInstruction"
            action-icon="Pen"
            class="edit-btn small skeletons-background"
            @click="editedInstruction = instruction"
          />
          <ContextActionButton
            v-if="canDeleteInstruction"
            action-icon="Close"
            class="remove-btn small skeletons-background"
            @click="instructionToDelete = instruction"
          />
        </div>

        <h1 class="page-title skeletons-text">
          {{ instruction.$t.title }}
        </h1>
        <p v-if="publicationDate" class="publication-date skeletons-text">
          {{ publicationDate }}
        </p>
      </div>
    </div>

    <TipTapOutput class="instruction-content skeletons-text" :content="instruction.$t.content" />
  </FetchLoader>

  <EditInstructionDrawer
    :is-opened="!!editedInstruction"
    :instruction="editedInstruction"
    @close="editedInstruction = null"
    @instruction-edited="() => refresh()"
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
  margin: 1rem 0;
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
</style>
