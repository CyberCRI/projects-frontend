<template>
    <div class="instruction-excerpt-wrapper">
        <ContextActionMenu
            class="instruction-actions"
            @edit="$emit('edit-instruction', instruction)"
            :can-edit="canEditInstruction"
            @delete="$emit('delete-instruction', instruction)"
            :can-delete="canDeleteInstruction"
        />

        <p class="clamped">{{ instructionText }}</p>
    </div>
</template>
<script>
import permissions from '@/mixins/permissions.ts'
import ContextActionMenu from '@/components/lpikit/ContextActionMenu/ContextActionMenu.vue'

export default {
    name: 'InstructionAdminListItem',

    mixins: [permissions],

    emits: ['delete-instruction', 'edit-instruction'],

    components: {
        ContextActionMenu,
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
}
</style>
