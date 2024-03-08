<template>
    <div class="create-instruction-page page-section-narrow">
        <h1 class="page-title">{{ $t('instructions.create.title') }}</h1>

        <InstructionForm ref="instructionForm" v-model="form" />

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
                :disabled="$refs?.instructionForm?.v$?.$invalid || asyncing"
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
} from '@/components/lpikit/InstructionForm/InstructionForm.vue'
import LpiButton from '@/components/lpikit/LpiButton/LpiButton.vue'
export default {
    name: 'CreateInstructionPage',
    components: {
        InstructionForm,
        LpiButton,
    },
    data() {
        return {
            form: defaultForm(),
            asyncing: false,
        }
    },
    methods: {
        cancel() {
            // TODO
            this.form = defaultForm()
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
            this.$router.push({ name: 'InstructionListPage' })
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
    border-top: $border-width-s solid $gray-4;
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
