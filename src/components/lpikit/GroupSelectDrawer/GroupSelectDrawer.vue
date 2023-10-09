<template>
    <DrawerLayout
        :is-opened="isOpened"
        :has-footer="false"
        :title="$t('group.select-group')"
        @close="closeModal"
        class="medium"
    >
        <section class="search-section">
            <SearchInput
                v-model="queryString"
                :full="true"
                :placeholder="$filters.capitalize($t('search.search-group'))"
                class="input"
                @enter="launchSearch"
                @delete-query="deleteQuery"
                ref="search-input"
            />
            <LpiButton
                :disabled="!queryString || isLoading"
                class="select-btn"
                left-icon="Search"
                data-test="search-btn"
                @click="launchSearch"
            />
        </section>
        <section v-if="isLoading" class="loader-ctn">
            <LoaderSimple />
        </section>
        <section v-else class="results-ctn">
            <GroupCard
                v-for="group in listGroups"
                :key="group.id"
                :group="group"
                :has-add-icon="true"
                @add="selectGroup(group)"
                :data-test="`drawer-group-card-${group.id}`"
            />
        </section>
    </DrawerLayout>
</template>

<script>
import DrawerLayout from '@/components/lpikit/Drawer/DrawerLayout.vue'
import GroupCard from '@/components/peopleKit/GroupCard.vue'
import SearchInput from '@/components/lpikit/SearchInput/SearchInput.vue'
import { searchGroups } from '@/api/projects.service.ts'
import LpiButton from '@/components/lpikit/LpiButton/LpiButton.vue'
import LoaderSimple from '@/components/lpikit/Loader/LoaderSimple.vue'

export default {
    name: 'GroupSelectDrawer',

    emits: ['close', 'select-group'],

    components: { DrawerLayout, GroupCard, SearchInput, LpiButton, LoaderSimple },

    data() {
        return {
            listGroups: [],
            completeListGroups: [],
            filters: {},
            queryString: '',
            isLoading: false,
        }
    },

    props: {
        isOpened: {
            type: Boolean,
            default: false,
        },
    },

    async created() {
        this.isLoading = true
        this.filters = {
            limit: 12,
            organizations: this.$store.getters['organizations/current']?.code,
        }
        this.completeListGroups = this.listGroups = (await searchGroups(null, this.filters)).results
        this.isLoading = false
    },

    methods: {
        async launchSearch() {
            if (this.queryString) {
                this.isLoading = true

                this.listGroups = (
                    await searchGroups(encodeURIComponent(this.queryString), this.filters)
                ).results

                this.isLoading = false
            }
        },

        async selectGroup(group) {
            this.$emit('select-group', group)
            this.closeModal()
        },

        closeModal() {
            this.$emit('close')
        },

        deleteQuery() {
            this.queryString = ''
            this.listGroups = this.completeListGroups
        },
    },
    watch: {
        isOpened(neo) {
            this.queryString = ''
            if (neo) {
                this.$nextTick(() =>
                    this.$refs['search-input'] &&
                    this.$refs['search-input'].$el.querySelector('.search-input').focus()
                        ? this.$refs['search-input'].$el.querySelector('.search-input').focus()
                        : null
                )
            }
        },
    },
}
</script>

<style lang="scss" scoped>
.clear {
    font-size: $font-size-s;
    color: $primary-dark;
    font-weight: 700;
    text-decoration: underline;
    margin-left: $space-l;
    cursor: pointer;
}

.search-section {
    display: flex;
    align-items: center;
    justify-content: stretch;
    gap: $space-m;
}

.loader-ctn {
    display: flex;
    justify-content: center;
    align-items: center;
    flex-grow: 1;
}

.results-ctn {
    display: flex;
    flex-wrap: wrap;
    align-content: flex-start;
    gap: $space-m;
    padding-top: $space-l;
    padding-bottom: $space-l;

    .selected-card {
        background-color: $primary-lighter;
    }
}
</style>
