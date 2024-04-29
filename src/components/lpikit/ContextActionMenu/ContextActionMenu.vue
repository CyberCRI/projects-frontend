<template>
    <ToolTip hover interactive v-if="canEdit || canDelete" placement="top" offset-distance="0">
        <template #custom-content>
            <div class="context-action-menu">
                <ContextActionButton
                    action-icon="Pen"
                    class="edit-btn small"
                    @click.stop.prevent="$emit('edit')"
                    v-if="canEdit"
                />
                <ContextActionButton
                    action-icon="Close"
                    class="remove-btn small"
                    @click.stop.prevent="$emit('delete')"
                    v-if="canDelete"
                />
            </div>
        </template>
        <ContextActionButton action-icon="DotsVertical" class="remove-btn small" />
    </ToolTip>
</template>
<script>
import ContextActionButton from '@/components/lpikit/LpiButton/ContextActionButton.vue'
import ToolTip from '@/components/lpikit/ToolTip/ToolTip.vue'
export default {
    name: 'ContextActionMenu',
    emits: ['delete', 'edit'],
    components: {
        ContextActionButton,
        ToolTip,
    },
    props: {
        canEdit: {
            type: Boolean,
            default: false,
        },
        canDelete: {
            type: Boolean,
            default: false,
        },
    },
}
</script>
<style lang="scss" scoped>
.context-action-menu {
    display: flex;
    gap: $space-2xs;
    padding: $space-2xs;
}
</style>
