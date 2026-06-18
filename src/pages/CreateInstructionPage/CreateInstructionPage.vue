<script setup lang="ts">
import { createInstruction } from '~/api/instruction.service'

import type { InstructionInput } from '~/models/instruction.model'
import useToasterStore from '~/stores/useToaster'

const toaster = useToasterStore()
const organizationCode = useOrganizationCode()
const router = useRouter()
const { t } = useNuxtI18n()

const asyncing = ref(false)
const invalid = ref(false)

const form = ref<InstructionInput>()

const cancel = () => router.push({ name: 'InstructionListPage' })

const onSubmit = () => {
  asyncing.value = true
  createInstruction(organizationCode, form.value)
    .then((instruction) => {
      toaster.pushSuccess(t('instructions.save.success'))
      router.push({
        name: 'InstructionPage',
        params: {
          slugOrId: instruction.id,
        },
      })
    })
    .catch(() => toaster.pushError(t('instructions.save.error')))
    .finally(() => (asyncing.value = false))
}

useLpiHead2({
  title: computed(() => t('instructions.create.title')),
})
</script>
<template>
  <div class="create-instruction-page page-section-narrow">
    <h1 class="page-title">
      {{ $t('instructions.create.title') }}
    </h1>

    <InstructionForm ref="instructionForm" v-model="form" @invalid="invalid = $event" />

    <div class="form-actions">
      <LpiButton
        :disabled="asyncing"
        :label="$t('common.cancel')"
        secondary
        class="footer__left-button"
        data-test="close-button"
        @click="cancel"
      />

      <LpiButton
        :disabled="invalid || asyncing"
        :label="$t('common.confirm')"
        :btn-icon="asyncing ? 'LoaderSimple' : null"
        class="footer__right-button"
        data-test="confirm-button"
        @click="onSubmit"
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
