<template>
    <div class="create-instruction-page page-section-narrow">
        <h1 class="page-title">{{ $t('instructions.create.title') }}</h1>

        <InstructionForm ref="instructionForm" v-model="form" @invalid="invalid = $event" />

        <div class="form-actions">
            <LpiButton
                :disabled="asyncing"
                :label="$filters.capitalize($t('common.cancel'))"
                secondary
                class="footer__left-button"
                @click="cancel"
                data-test="close-button"
            />

            <LpiButton
                :disabled="invalid || asyncing"
                :label="$filters.capitalize($t('common.confirm'))"
                :btn-icon="asyncing ? 'LoaderSimple' : null"
                class="footer__right-button"
                @click="saveInstruction"
                data-test="confirm-button"
            />
        </div>
    </div>
</template>
<script>
import InstructionForm, {
    defaultForm,
} from '@/components/instruction/InstructionForm/InstructionForm.vue'
import LpiButton from '@/components/base/button/LpiButton.vue'
import { createInstruction } from '@/api/instruction.service'
import useToasterStore from '@/stores/useToaster.ts'
import useOrganizationsStore from '@/stores/useOrganizations.ts'

export default {
    name: 'CreateInstructionPage',
    components: {
        InstructionForm,
        LpiButton,
    },
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
            form: defaultForm(),
            asyncing: false,
            invalid: false,
        }
    },
    methods: {
        cancel() {
            this.form = defaultForm()
            this.$router.push({ name: 'InstructionListPage' })
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
                    publication_date: this.form.publication_date,
                    people_groups_ids: Object.entries(this.form.people_groups)
                        .filter(([, value]) => value)
                        .map(([id]) => id),
                }
                await createInstruction(this.organizationsStore.current?.code, formData)
                this.toaster.pushSuccess(this.$t('instructions.save.success'))
            } catch (err) {
                this.toaster.pushError(`${this.$t('instructions.save.error')} (${err})`)
                console.error(err)
            } finally {
                this.asyncing = false
                this.$router.push({ name: 'InstructionListPage' })
            }
        },
    },
}
</script>
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
