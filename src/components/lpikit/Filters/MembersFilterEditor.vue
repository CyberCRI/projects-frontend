<template>
    <div>
        <div class="filter-members-selected">
            <FilterValue
                v-for="(member, index) in selection"
                :key="member.id"
                :label="member.given_name + ' ' + member.family_name"
                icon="Close"
                @click="removeFilter(index)"
                class="actionable"
            />
        </div>

        <div class="filter-members-search">
            <FilterSearchInput
                :placeholder="$t('search.search-user')"
                class="search-input-ctn"
                v-model="memberSearch"
                ref="search-input-component"
            />
        </div>

        <div class="filter-members-suggestions">
            <FilterValue
                v-for="user in usersList"
                @click="addMember(user)"
                :key="user.id"
                :label="user.given_name + ' ' + user.family_name"
                class="actionable suggested"
            />
        </div>
    </div>
</template>

<script>
import FilterValue from '@/components/lpikit/Filters/FilterValue.vue'
import FilterSearchInput from '@/components/lpikit/Filters/FilterSearchInput.vue'
import { searchPeopleProject } from '@/api/people.service'

export default {
    name: 'MembersFilterEditor',

    components: {
        FilterSearchInput,
        FilterValue,
    },

    emits: ['update:model-value'],

    props: {
        modelValue: {
            type: Array,
            required: true,
        },
    },

    data() {
        return {
            selection: [],
            memberSearch: '',
            usersList: [],
        }
    },
    mounted() {
        this.focusInput()
    },
    methods: {
        removeFilter(index) {
            this.selection.splice(index, 1)
            this.$emit('update:model-value', this.selection)
        },

        addMember(member) {
            this.selection.push(member)
            this.$emit('update:model-value', this.selection)
            this.focusInput()
        },

        async getPeople(searchString) {
            const results = await searchPeopleProject({
                search: searchString,
                org_id: this.$store.getters['organizations/current'].id,
            })
            const filteredResults = results.filter(
                (result) => !this.selection.some((member) => member.id == result.id)
            )
            this.usersList = filteredResults
        },
        focusInput() {
            const searchInput = this.$refs['search-input-component'].$refs['search-input']
            this.$nextTick(() => {
                searchInput.focus()
            })
        },
    },

    watch: {
        modelValue: {
            handler: function (neo, old) {
                if (neo && neo != old) {
                    this.selection = [...neo]
                }
            },
            immediate: true,
            deep: true,
        },

        memberSearch(neo, old) {
            if (neo && neo != old) {
                if (neo.length < 3) {
                    this.usersList = []
                } else {
                    this.getPeople(neo)
                }
            }
        },
    },
}
</script>

<style scoped lang="scss">
.filter-members-selected,
.filter-members-suggestions {
    display: flex;
    flex-wrap: wrap;
    gap: $space-2xs;
}

.filter-members-selected {
    margin-bottom: $space-m;
}

.filter-members-suggestions {
    margin-top: $space-m;
}
</style>
