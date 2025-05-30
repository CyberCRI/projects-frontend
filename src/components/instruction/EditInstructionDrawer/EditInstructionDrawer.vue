<template>
  <BaseDrawer
    :confirm-action-name="$t('common.save')"
    :confirm-action-disabled="invalid"
    :is-opened="isOpened"
    :title="$t('instructions.drawer.title')"
    class="instruction-drawer medium"
    :asyncing="asyncing"
    @confirm="saveInstruction"
    @close="cancel"
  >
    <InstructionForm
      ref="instructionForm"
      v-model="form"
      class="instruction-form"
      @invalid="invalid = $event"
    />
  </BaseDrawer>
</template>
<script>
import BaseDrawer from '@/components/base/BaseDrawer.vue'
import InstructionForm from '@/components/instruction/InstructionForm/InstructionForm.vue'
import { createInstruction, putInstruction } from '@/api/instruction.service'
import useToasterStore from '@/stores/useToaster.ts'
import useOrganizationsStore from '@/stores/useOrganizations.ts'
export default {
  name: 'EditInstructionDrawer',

  components: {
    BaseDrawer,
    InstructionForm,
  },

  props: {
    instruction: {
      type: [Object, null],
      required: true,
    },
    isOpened: {
      type: Boolean,
      required: true,
    },
  },

  emits: ['close', 'instruction-edited'],
  setup() {
    const toaster = useToasterStore()
    const organizationsStore = useOrganizationsStore()
    return {
      toaster,
      organizationsStore,
    }
  },

  data() {
    return {
      form: null,
      asyncing: false,
      invalid: false,
    }
  },

  watch: {
    instruction: {
      handler(instruction) {
        if (instruction)
          this.form = {
            ...instruction,
            publication_date: new Date(instruction.publication_date),
            // only reduce to array if not already an object
            people_groups: instruction.people_groups.reduce
              ? instruction.people_groups.reduce((acc, group) => {
                  acc[group.id] = true
                  return acc
                }, {})
              : instruction.people_groups,
          }
      },
      immediate: true,
    },
  },

  methods: {
    cancel() {
      this.$emit('close')
    },
    async saveInstruction() {
      const isValid = await this.$refs.instructionForm.v$.$validate()
      if (!isValid) {
        return
      }
      this.asyncing = true

      try {
        const formData = {
          ...this.form,
          publication_date: this.form.publication_date.toISOString(),
          people_groups_ids: Object.entries(this.form.people_groups)
            .filter(([, value]) => value)
            .map(([id]) => id),
        }
        let savedInstruction
        if (this.instruction?.id) {
          savedInstruction = await putInstruction(
            this.organizationsStore.current?.code,
            this.instruction?.id,
            formData
          )
        } else {
          savedInstruction = await createInstruction(
            this.organizationsStore.current?.code,
            formData
          )
        }
        this.toaster.pushSuccess(this.$t('instructions.save.success'))

        this.$emit('instruction-edited', savedInstruction)
      } catch (err) {
        this.toaster.pushError(`${this.$t('instructions.save.error')} (${err})`)
        console.error(err)
      } finally {
        this.asyncing = false
        this.$emit('close')
      }
    },
  },
}
</script>
