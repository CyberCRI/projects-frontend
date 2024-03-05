<template>
    <ul>
        <li class="sub-list">
            <div class="top-list">
                <div class="texts" @click="showChildren">
                    <div>
                        <LpiCheckbox
                            label=""
                            :model-value="selectedGroups[group.id]"
                            @update:model-value="toggleGroup(group)"
                            class="checkbox"
                            @click.stop
                        />
                    </div>
                    <div class="name" :class="{ 'green-color': group.children?.length }">
                        {{ group.name }}
                    </div>

                    <div class="icon-td">
                        <IconImage
                            v-if="group.children?.length"
                            class="icon green-color"
                            :name="this.showChild ? 'ChevronUp' : 'ChevronDown'"
                        />
                    </div>
                </div>
            </div>
            <div v-if="group.children && this.showChild" class="child-list">
                <EventGroupsElement
                    v-for="child in group.children"
                    :key="child.id"
                    :group="child"
                    class="nested-list"
                    :selected-groups="selectedGroups"
                    @toggle-group="toggleGroup"
                />
            </div>
        </li>
    </ul>
</template>
<script>
import IconImage from '@/components/svgs/IconImage.vue'
import LpiCheckbox from '@/components/lpikit/Checkbox/LpiCheckbox.vue'

export default {
    name: 'EventGroupsElement',

    emits: ['move', 'add', 'edit'],

    components: {
        IconImage,
        LpiCheckbox,
    },

    props: {
        group: {
            type: Object,
            required: true,
        },
        selectedGroups: {
            type: Object,
            default: () => ({}),
        },
    },

    data() {
        return {
            showChild: false,
        }
    },

    methods: {
        showChildren() {
            this.showChild = !this.showChild
        },
        toggleGroup(group) {
            this.$emit('toggle-group', group)
        },
    },
}
</script>
<style lang="scss" scoped>
.icon-td {
    width: pxToRem(25px);
    padding: 7px;
}
.top-list {
    display: flex;
    justify-content: space-between;
}

.sub-list {
    display: flex;
    flex-direction: column;
    width: 100%;
}

li {
    display: flex;
}

.texts {
    display: flex;
    width: 70%;
    align-items: center;
    cursor: pointer;
}

.child-list {
    padding-left: pxToRem(35px);
}

.nested-list {
    display: flex;
    justify-content: flex-end;
}

.name {
    padding: $space-unit;
}

.green-color {
    fill: $primary-dark;
    color: $primary-dark;
}

.checkbox {
    margin: 0;
}
</style>
