<template>
  <BaseDrawer
    :is-opened="isOpened"
    no-footer
    :title="$t('group.select-group')"
    class="medium"
    @close="closeModal"
  >
    <section class="search-section">
      <SearchInput
        ref="search-input"
        v-model="queryString"
        :full="true"
        :placeholder="$t('search.search-group')"
        class="input"
        @enter="launchSearch"
        @delete-query="deleteQuery"
      />
      <LpiButton
        :disabled="!queryString || isLoading"
        class="select-btn"
        btn-icon="Search"
        data-test="search-btn"
        @click="launchSearch"
      />
    </section>
    <section v-if="isLoading" class="loader-ctn">
      <LoaderSimple />
    </section>
    <section v-else class="results-ctn custom-scrollbar">
      <GroupCard
        v-for="group in listGroups"
        :key="group.id"
        :group="group"
        :has-add-icon="true"
        :data-test="`drawer-group-card-${group.id}`"
        @add="selectGroup(group)"
      />
    </section>
  </BaseDrawer>
</template>

<script>
import BaseDrawer from '@/components/base/BaseDrawer.vue'
import GroupCard from '@/components/group/GroupCard.vue'
import SearchInput from '@/components/base/form/SearchInput.vue'
import { searchGroups } from '@/api/search.service.ts'
import LpiButton from '@/components/base/button/LpiButton.vue'
import LoaderSimple from '@/components/base/loader/LoaderSimple.vue'
import useOrganizationsStore from '@/stores/useOrganizations.ts'
export default {
  name: 'GroupSelectDrawer',

  components: { BaseDrawer, GroupCard, SearchInput, LpiButton, LoaderSimple },

  props: {
    isOpened: {
      type: Boolean,
      default: false,
    },
  },

  emits: ['close', 'select-group'],

  setup() {
    const organizationsStore = useOrganizationsStore()
    return {
      organizationsStore,
    }
  },

  data() {
    return {
      listGroups: [],
      completeListGroups: [],
      filters: {},
      queryString: '',
      isLoading: false,
    }
  },
  watch: {
    async isOpened(neo) {
      if (neo) {
        await this.init()
        this.$nextTick(() =>
          this.$refs['search-input'] &&
          this.$refs['search-input'].$el.querySelector('.search-input').focus()
            ? this.$refs['search-input'].$el.querySelector('.search-input').focus()
            : null
        )
      }
    },
  },

  async created() {
    await this.init()
  },

  methods: {
    getOrganizationCode() {
      return this.organizationsStore.current?.code
    },
    async init() {
      this.isLoading = true
      this.completeListGroups = this.listGroups = (
        await searchGroups(this.getOrganizationCode(), {})
      ).results
      this.isLoading = false
    },
    async launchSearch() {
      if (this.queryString) {
        this.isLoading = true
        this.filter = {
          search: encodeURIComponent(this.queryString),
        }
        this.listGroups = (await searchGroups(this.getOrganizationCode(), this.filter)).results
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
  padding-bottom: $space-l;
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
  padding-bottom: $space-l;
  overflow: auto;

  .selected-card {
    background-color: $primary-lighter;
  }
}
</style>
