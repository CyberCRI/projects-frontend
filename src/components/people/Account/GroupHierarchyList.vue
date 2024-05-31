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
            >
                <input
                    type="checkbox"
                    :id="item.id"
                    :name="item.name"
                    :checked="item.value"
                    @change="setGroupList(item)"
                />
                <label
                    :for="item.id"
                    class="list-label"
                    :class="{
                        'list-label--has-children': item.children.length > 0,
                    }"
                    >{{ item.name }}</label
                >
            </GroupHierarchyList>
        </ul>
    </li>
</template>

<script>
import IconImage from '@/components/base/media/IconImage.vue'

export default {
    name: 'GroupHierarchyList',
    components: { IconImage },
    emits: ['add-group'],
    props: {
        parent: {
            type: Object,
            default: () => {},
        },
    },
    data() {
        return {
            show: false,
        }
    },
    methods: {
        setGroupList(group) {
            this.$emit('add-group', group)
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
