<template>
    <div class="group-section">
        <label>
            <span class="section-title">
                {{ $filters.capitalize($t('group.form.parent-group-label')) }}
            </span>
            <span
                class="add-parent-group-card"
                @click="drawerIsOpen = true"
                data-test="add-parent-group-card"
            >
                <IconImage v-if="!modelValue" name="Plus" />
                <IconImage v-else name="Pen" />
                <span v-if="!modelValue">{{ $filters.capitalize($t('group.form.add')) }}</span>
                <span v-else>{{ $filters.capitalize($t('group.form.edit')) }}</span>
            </span>
        </label>

        <div v-if="modelValue" class="group-grid">
            <GroupCard :group="modelValue" />
        </div>

        <PickGroupDrawer
            :drawer-title="$t('group.form.add-parent-group')"
            :subtitle="$t('admin.groups.subtitle-edit-child')"
            @close="closeDrawer"
            @confirm="confirmGroup"
            :is-opened="drawerIsOpen"
            :groups="groups"
            :initial-group="modelValue"
            :forbidden-ids="forbiddenIds"
            :rooted="true"
        />
    </div>
</template>

<script>
import IconImage from '@/components/base/media/IconImage.vue'
import GroupCard from '@/components/group/GroupCard.vue'
import PickGroupDrawer from '@/components/group/PickGroupDrawer/PickGroupDrawer.vue'

export default {
    name: 'ParentGroupSection',

    emits: ['update:modelValue'],

    components: {
        GroupCard,
        IconImage,
        PickGroupDrawer,
    },

    props: {
        modelValue: {
            type: [Object, null],
            default: null,
        },
        groups: {
            type: Array,
            default: () => [],
        },
    },

    data() {
        return {
            drawerIsOpen: false,
            forbiddenIds: [],
        }
    },

    methods: {
        closeDrawer() {
            this.drawerIsOpen = false
        },
        confirmGroup(group) {
            this.$emit('update:modelValue', group)
            this.closeDrawer()
        },
    },
}
</script>

<style lang="scss" scoped>
.group-section {
    label {
        display: flex;
        justify-content: space-between;
        align-items: center;
        flex-direction: row;
        width: 100%;
        font-size: $font-size-m;
        margin-bottom: $space-l;

        .section-title {
            color: $black;
            font-weight: bold;
            display: block;
        }
    }

    .group-grid {
        display: grid;
        grid-template-columns: 1fr 1fr;
        justify-items: stretch;
        gap: $space-l;
    }

    .add-parent-group-card {
        display: inline-flex;
        justify-content: center;
        align-items: center;
        background: $white;
        color: $primary-dark;
        cursor: pointer;
        font-weight: 700;
        font-size: 16px;

        svg {
            width: 18px;
            fill: $primary-dark;
        }
    }

    .disabled {
        color: $almost-white;

        svg {
            width: 18px;
            fill: $almost-white;
        }
    }
}
</style>
