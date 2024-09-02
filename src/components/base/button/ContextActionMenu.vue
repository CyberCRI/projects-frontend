<template>
    <MenuTip>
        <template #custom-content>
            <div class="context-action-menu">
                <slot>
                    <ContextActionButton
                        action-icon="Pen"
                        class="edit-btn"
                        secondary
                        no-border
                        @click.stop.prevent="$emit('edit')"
                        v-if="canEdit"
                        :action-label="$t('common.edit')"
                    />
                    <ContextActionButton
                        action-icon="Close"
                        class="remove-btn"
                        secondary
                        no-border
                        @click.stop.prevent="$emit('delete')"
                        v-if="canDelete"
                        :action-label="$t('common.delete')"
                    />
                </slot>
            </div>
        </template>
        <ContextActionButton
            secondary
            no-border
            :action-icon="triggerIcon"
            :action-label="triggerLabel"
            class="remove-btn"
        />
    </MenuTip>
</template>
<script>
import ContextActionButton from '@/components/base/button/ContextActionButton.vue'
import MenuTip from '@/components/base/MenuTip.vue'
export default {
    name: 'ContextActionMenu',
    emits: ['delete', 'edit'],
    components: {
        ContextActionButton,
        MenuTip,
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
        triggerIcon: {
            type: String,
            default: 'DotsHorizontal',
        },
        triggerLabel: {
            type: String,
            default: '',
        },
    },
}
</script>
<style lang="scss" scoped>
.context-action-menu {
    display: flex;
    flex-flow: column nowrap;
    gap: $space-s;
}
</style>
