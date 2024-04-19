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
        <FilterSearchInput
            class="group-filter"
            :placeholder="$t('event.form.people_groups.filter')"
            v-model.trim="groupFilter"
        />
        <ul>
            <MultiGroupPickerElement
                :key="allSelectedPseudoGroup.id"
                :group="allSelectedPseudoGroup"
                :selected-groups="pseudoGroupModelValue"
                @toggle-group="onToggleSelectAll"
                :filter="groupFilter"
            />

            <MultiGroupPickerElement
                v-for="group in allGroups"
                :key="group.id"
                :group="group"
                :selected-groups="modelValue"
                @toggle-group="onToggleGroup"
                :filter="groupFilter"
                :force-open="groupFilter.length"
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
import FilterSearchInput from '@/components/peopleKit/Filters/FilterSearchInput.vue'
export default {
    name: 'MultiGroupPicker',

    emits: ['update:modelValue'],

    components: {
        MultiGroupPickerElement,
        LoaderSimple,
        FilterValue,
        FilterSearchInput,
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

    computed: {
        allSelectedPseudoGroup() {
            return {
                id: -1,
                name: this.$t('event.form.people_groups.all'),
                children: [],
                disabled: this.pseudoGroupModelValue['-1'],
            }
        },

        pseudoGroupModelValue() {
            const values = Object.values(this.modelValue)
            return {
                '-1': !values.length || !values.some((value) => value),
            }
        },
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

        onToggleSelectAll() {
            if (!this.pseudoGroupModelValue['-1']) {
                const groups = {
                    ...this.modelValue,
                }
                for (let key of Object.keys(groups)) {
                    groups[key] = false
                }

                this.$emit('update:modelValue', groups)
            }
        },

        buildIndex(groupList) {
            groupList.forEach((group) => {
                this.groupIndex[group.id] = group.name
                if (group.children) {
                    this.buildIndex(group.children)
                }
            })
        },

        async markGroup(group) {
            let show = false
            for (let child of group.children) {
                const childrenMarked = await this.markGroup(child)
                show = show || childrenMarked
            }
            show = show || group.name.toLowerCase().includes(this.groupFilter.toLowerCase())
            group.hidden = !show
            return show
        },

        markAllGroups: throttle(async function markAllgroups() {
            // dont directly modify allGroup
            // because it will cause a lot of re-render
            let groups = JSON.parse(JSON.stringify(this.allGroups))
            for (let group of groups) {
                await this.markGroup(group)
            }
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
