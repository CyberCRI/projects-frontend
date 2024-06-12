<template>
    <li class="list-body">
        <span class="header">
            <slot></slot>
            <IconImage
                v-if="parent && parent.children.length > 0"
                @click="show = !show"
                :name="show ? 'ChevronUp' : 'ChevronDown'"
                class="icon"
            ></IconImage>
        </span>

        <ul class="list-body" v-if="parent && parent.children.length > 0 && show">
            <GroupHierarchyList
                v-for="item in parent.children"
                :key="item.id"
                :parent="item"
                @add-group="setGroupList"
                :selected-groups="selectedGroups"
            >
                <LpiCheckbox
                    :class="{
                        'list-label--has-children': item.children.length > 0,
                    }"
                    :label="item.name"
                    :model-value="!!selectedGroups['#' + item.id]"
                    @update:model-value="setGroupList(item.id)"
                />
            </GroupHierarchyList>
        </ul>
    </li>
</template>

<script>
import IconImage from '@/components/base/media/IconImage.vue'
import LpiCheckbox from '@/components/base/form/LpiCheckbox.vue'

export default {
    name: 'GroupHierarchyList',
    components: { IconImage, LpiCheckbox },
    emits: ['add-group'],
    props: {
        parent: {
            type: Object,
            default: () => {},
        },

        selectedGroups: {
            type: Object, // map {[groupid]: 'members'|'leaders'|'managers'|false}
            required: true,
        },
    },
    data() {
        return {
            show: false,
        }
    },
    methods: {
        setGroupList(groupId) {
            this.$emit('add-group', groupId)
        },
    },
}
</script>

<style lang="scss" scoped>
.list-body {
    padding: $space-2xs $space-m;

    .header {
        display: inline-flex;
        align-items: center;
    }

    .icon {
        fill: $primary-dark;
        width: pxToRem(20px);
    }
}

.list-label {
    font-size: $font-size-s;

    &--has-children {
        font-weight: 700;
        color: $primary-dark;
    }
}
</style>
