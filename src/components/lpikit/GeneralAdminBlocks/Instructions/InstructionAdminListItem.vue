<template>
    <div class="instruction-excerpt-wrapper">
        <div class="instruction-actions" v-if="canEditInstruction || canDeleteInstruction">
            <ContextActionButton
                action-icon="Pen"
                class="edit-btn small"
                @click="$emit('edit-instruction', instruction)"
                v-if="canEditInstruction"
            />
            <ContextActionButton
                action-icon="Close"
                class="remove-btn small"
                @click="$emit('delete-instruction', instruction)"
                v-if="canDeleteInstruction"
            />
        </div>
        <p class="clamped">{{ instructionText }}</p>
    </div>
</template>
<script>
import permissions from '@/mixins/permissions.ts'
import ContextActionButton from '@/components/lpikit/LpiButton/ContextActionButton.vue'

export default {
    name: 'InstructionAdminListItem',

    mixins: [permissions],

    emits: ['delete-instruction', 'edit-instruction'],

    components: {
        ContextActionButton,
    },

    props: {
        instruction: {
            type: Object,
            default: () => ({}),
        },
    },

    computed: {
        instructionText() {
            return this.instruction.content.replace(/<[^>]+>/g, ' ').substring(0, 255)
        },
    },
}
</script>
<style lang="scss" scoped>
.instruction-excerpt-wrapper {
    position: relative;
    padding-right: 1.4rem;
}

.clamped {
    display: -webkit-box;
    -webkit-line-clamp: 3;
    -webkit-box-orient: vertical;
    overflow: hidden;
    line-height: 1.5;
}

.instruction-actions {
    position: absolute;
    top: 0;
    right: 0;
    display: flex;
    flex-direction: column;
    gap: $space-2xs;
    align-items: center;
    justify-content: flex-end;
}
</style>
