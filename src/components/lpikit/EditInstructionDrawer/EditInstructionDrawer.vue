<template>
    <DrawerLayout
        :confirm-action-name="$t('common.save')"
        :confirm-action-disabled="$refs?.instructionForm?.v$?.$invalid"
        :is-opened="isOpened"
        :title="$t('instructions.drawer.title')"
        class="instruction-drawer medium"
        @confirm="saveInstruction"
        @close="cancel"
    >
        <InstructionForm ref="instructionForm" v-model="form" class="instruction-form" />
    </DrawerLayout>
</template>
<script>
import DrawerLayout from '@/components/lpikit/Drawer/DrawerLayout.vue'
import InstructionForm from '@/components/lpikit/InstructionForm/InstructionForm.vue'
export default {
    name: 'EditInstructionDrawer',

    emits: ['close'],

    components: {
        DrawerLayout,
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

    data() {
        return {
            form: null,
            asyncing: false,
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
                        groups: instruction.groups.reduce
                            ? instruction.groups.reduce((acc, group) => {
                                  acc[group.id] = true
                                  return acc
                              }, {})
                            : instruction.groups,
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
            const formData = {
                ...this.form,
                publication_date: this.form.publication_date.toISOString(),
                groups: Object.entries(this.form.groups)
                    .filter(([, value]) => value)
                    .map(([id]) => id),
            }
            await new Promise((resolve) => setTimeout(resolve, 1000))
            console.log('saveInstruction', formData)
            this.asyncing = false
            this.$emit('close')
        },
    },
}
</script>
