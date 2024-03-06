<template>
    <div class="loader-ctn" v-if="loading">
        <LoaderSimple />
    </div>
    <template v-else>
        <div class="selected-groups">
            <template v-for="[groupId, isSelected] in Object.entries(modelValue)" :key="groupId">
                <FilterValue
                    v-if="isSelected"
                    :label="groupIndex[groupId]"
                    icon="Close"
                    @click="onToggleGroup({ id: groupId })"
                />
            </template>
        </div>
        <input
            type="search"
            class="group-filter"
            :placeholder="$t('event.form.groups.filter')"
            v-model="groupFilter"
        />
        <ul>
            <MultiGroupPickerElement
                v-for="group in allGroups"
                :key="group.id"
                :group="group"
                :selected-groups="modelValue"
                @toggle-group="onToggleGroup"
                :filter="groupFilter"
            />
        </ul>
    </template>
</template>
<script>
import LoaderSimple from '@/components/lpikit/Loader/LoaderSimple.vue'
import throttle from 'lodash/throttle'
import MultiGroupPickerElement from './MultiGroupPickerElement.vue'
import { getHierarchyGroups } from '@/api/group.service.ts'
import FilterValue from '@/components/peopleKit/Filters/FilterValue.vue'
export default {
    name: 'MultiGroupPicker',

    emits: ['update:modelValue'],

    components: {
        MultiGroupPickerElement,
        LoaderSimple,
        FilterValue,
    },
    props: {
        modelValue: {
            type: Object,
            required: true,
        },
    },

    data() {
        return {
            groupFilter: '',
            groupIndex: {},
            loading: false,
            allGroups: [],
        }
    },

    watch: {
        groupFilter: {
            handler() {
                this.markAllGroups()
            },
            immediate: true,
        },
    },

    async mounted() {
        this.loading = true
        await this.loadGroups()
        this.markAllGroups()
        this.buildIndex(this.allGroups)
        this.loading = false
    },

    methods: {
        async loadGroups() {
            this.allGroups = (
                await getHierarchyGroups(this.$store.state.organizations.current.code)
            ).children
        },
        onToggleGroup(group) {
            const groups = {
                ...this.modelValue,
                [group.id]: !this.modelValue[group.id],
            }
            this.$emit('update:modelValue', groups)
        },
        buildIndex(groupList) {
            groupList.forEach((group) => {
                this.groupIndex[group.id] = group.name
                if (group.children) {
                    this.buildIndex(group.children)
                }
            })
        },

        markGroup(group) {
            let show = false
            group.children?.forEach((child) => {
                show = show || this.markGroup(child)
            })
            show = show || group.name.toLowerCase().includes(this.groupFilter.toLowerCase())
            group.hidden = !show
            return show
        },

        markAllGroups: throttle(function markAllgroups() {
            // dont directly modify allGroup
            // because it will cause a lot of re-render
            let groups = JSON.parse(JSON.stringify(this.allGroups))
            groups.forEach((group) => {
                this.markGroup(group)
            })
            this.allGroups = groups
        }, 500),
    },
}
</script>
<style lang="scss" scoped>
.selected-groups {
    display: flex;
    gap: $space-m;
    margin-bottom: $space-m;
}

.group-filter {
    width: 100%;
}
</style>
