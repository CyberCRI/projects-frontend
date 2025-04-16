<script setup>
import { defaultForm } from '@/components/instruction/InstructionForm/InstructionForm.vue'
import { createInstruction } from '@/api/instruction.service'
import useToasterStore from '@/stores/useToaster.ts'
import useOrganizationsStore from '@/stores/useOrganizations.ts'
import { getOrganizationByCode } from '@/api/organizations.service'

const toaster = useToasterStore()
const organizationsStore = useOrganizationsStore()
const router = useRouter()
const { t } = useI18n()

const form = ref(defaultForm())
const asyncing = ref(false)
const invalid = ref(false)

const instructionForm = useTemplateRef('instructionForm')

const cancel = () => {
  form.value = defaultForm()
  router.push({ name: 'InstructionListPage' })
}

const saveInstruction = async () => {
  const isValid = await instructionForm.value?.v$.$validate()
  if (!isValid) {
    return
  }
  asyncing.value = true

  try {
    const formData = {
      ...form.value,
      publication_date: form.value.publication_date,
      people_groups_ids: Object.entries(form.value.people_groups)
        .filter(([, value]) => value)
        .map(([id]) => id),
    }
    await createInstruction(organizationsStore.current?.code, formData)
    toaster.pushSuccess(t('instructions.save.success'))
  } catch (err) {
    toaster.pushError(`${t('instructions.save.error')} (${err})`)
    console.error(err)
  } finally {
    asyncing.value = false
    router.push({ name: 'InstructionListPage' })
  }
}

try {
  const runtimeConfig = useRuntimeConfig()
  const organization = await getOrganizationByCode(runtimeConfig.public.appApiOrgCode)
  const { image, dimensions } = useImageAndDimension(organization?.banner_image, 'medium')
  useLpiHead(
    useRequestURL().toString(),
    computed(() => t('instructions.create.title')),
    organization?.dashboard_subtitle,
    image,
    dimensions
  )
} catch (err) {
  console.log(err)
}
</script>
<template>
  <div class="create-instruction-page page-section-narrow">
    <h1 class="page-title">
      {{ $t('instructions.create.title') }}
    </h1>

    <ClientOnly>
      <InstructionForm ref="instructionForm" v-model="form" @invalid="invalid = $event" />
    </ClientOnly>

    <div class="form-actions">
      <LpiButton
        :disabled="asyncing"
        :label="$filters.capitalize($t('common.cancel'))"
        secondary
        class="footer__left-button"
        data-test="close-button"
        @click="cancel"
      />

      <LpiButton
        :disabled="invalid || asyncing"
        :label="$filters.capitalize($t('common.confirm'))"
        :btn-icon="asyncing ? 'LoaderSimple' : null"
        class="footer__right-button"
        data-test="confirm-button"
        @click="saveInstruction"
      />
    </div>
  </div>
</template>
<style lang="scss" scoped>
.page-title {
  margin-top: pxToRem(60px);
  margin-bottom: pxToRem(60px);
}

.form-actions {
  margin-top: 2rem;
  z-index: 100;
  flex-shrink: 0;
  width: 100%;
  display: flex;
  justify-content: center;
  border-top: $border-width-s solid $lighter-gray;
  color: $primary-dark;
  font-weight: 700;
  padding-top: $space-l;
  padding-bottom: $space-l;
  position: sticky;
  bottom: 0;
  background: $white;
  gap: $space-l;

  button ~ button {
    text-transform: capitalize;
  }
}
</style>
