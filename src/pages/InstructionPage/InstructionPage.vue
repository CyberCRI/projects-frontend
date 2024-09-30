<template>
    <div class="instruction-list-page page-section-medium">
        <div class="instruction-header">
            <BreadCrumbs :breadcrumbs="breadcrumbs" />
            <div
                class="intruction-actions"
                v-if="instruction && (canEditInstruction || canDeleteInstruction)"
            >
                <ContextActionButton
                    action-icon="Pen"
                    class="edit-btn small"
                    @click="editedInstruction = instruction"
                    v-if="canEditInstruction"
                />
                <ContextActionButton
                    action-icon="Close"
                    class="remove-btn small"
                    @click="instructionToDelete = instruction"
                    v-if="canDeleteInstruction"
                />
            </div>

            <SkeletonComponent
                v-if="loading"
                tag="h1"
                class="page-title centered-skeleton"
                height="24px"
                width="50%"
            />
            <h1 v-else-if="instruction" class="page-title">{{ instruction.title }}</h1>
            <SkeletonComponent
                v-if="loading"
                tag="p"
                class="publication-date centered-skeleton"
                height="16px"
                width="100px"
            />
            <p v-else-if="instruction" class="publication-date">{{ publicationDate }}</p>
        </div>
    </div>
    <div class="page-section-narrow" v-if="loading">
        <SkeletonComponent class="text-skeleton" height="16px" />
        <SkeletonComponent class="text-skeleton" height="16px" />
        <SkeletonComponent class="text-skeleton" height="16px" />
    </div>
    <div class="page-section-narrow" v-else-if="instruction">
        <div class="instruction-content" v-html="instruction.content"></div>
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
        cancel-button-label="common.cancel"
        confirm-button-label="common.delete"
        @cancel="instructionToDelete = null"
        @confirm="deleteInstruction"
        :asyncing="isDeletingInstruction"
    />
</template>
<script>
import BreadCrumbs from '@/components/base/navigation/BreadCrumbs.vue'
import ContextActionButton from '@/components/base/button/ContextActionButton.vue'
import permissions from '@/mixins/permissions'
import EditInstructionDrawer from '@/components/instruction/EditInstructionDrawer/EditInstructionDrawer.vue'
import ConfirmModal from '@/components/base/modal/ConfirmModal.vue'
import SkeletonComponent from '@/components/base/loader/SkeletonComponent.vue'
import { getInstruction, deleteInstruction } from '@/api/instruction.service'
import useToasterStore from '@/stores/useToaster.ts'
import useOrganizationsStore from '@/stores/useOrganizations.ts'
export default {
    name: 'InstructionPage',

    mixins: [permissions],

    components: {
        BreadCrumbs,
        ContextActionButton,
        EditInstructionDrawer,
        ConfirmModal,
        SkeletonComponent,
    },
    setup() {
        const toaster = useToasterStore()
        const organizationsStore = useOrganizationsStore()
        return {
            toaster,
            organizationsStore,
        }
    },

    props: {
        slugOrId: {
            type: String,
            required: true,
        },
    },

    data() {
        return {
            instruction: null,
            loading: false,
            editedInstruction: null,
            instructionToDelete: null,
            isDeletingInstruction: false,
        }
    },

    mounted() {
        this.loadInstruction()
    },

    computed: {
        breadcrumbs() {
            return [
                {
                    name: 'Instructions',
                    route: { name: 'InstructionListPage' },
                },
            ]
        },

        publicationDate() {
            return this.instruction?.publication_date
                ? this.$d(new Date(this.instruction.publication_date))
                : ''
        },
    },

    methods: {
        async loadInstruction() {
            this.loading = true
            // TODO: Fetch instuction
            try {
                this.instruction = await getInstruction(
                    this.organizationsStore.current?.code,
                    this.slugOrId
                )

                this.loading = false
            } catch (err) {
                console.error(err)
                this.$router.replace({
                    name: 'page404',
                    params: { pathMatch: this.$route.path.substring(1).split('/') },
                })
            }
        },

        async deleteInstruction() {
            this.isDeletingInstruction = true
            try {
                await deleteInstruction(
                    this.organizationsStore.current?.code,
                    this.instructionToDelete.id
                )
                this.toaster.pushSuccess(this.$t('instructions.delete.success'))
            } catch (err) {
                this.toaster.pushError(`${this.$t('instructions.delete.error')} (${err})`)
                console.error(err)
            } finally {
                this.instructionToDelete = null
                this.isDeletingInstruction = false
                this.$router.push({ name: 'InstructionListPage' })
            }
        },
    },
}
</script>
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
