<template>
  <div v-if="loading" class="loader-ctn">
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
      v-model.trim="groupFilter"
      class="group-filter"
      :placeholder="$t('event.form.people_groups.filter')"
    />
    <ul>
      <MultiGroupPickerElement
        v-if="hasPublicField"
        :key="publicPseudoGroup.id"
        :group="publicPseudoGroup"
        :selected-groups="publicPseudoGroupModelValue"
        :filter="groupFilter"
        @toggle-group="onTogglePublic"
      />

      <MultiGroupPickerElement
        :key="allSelectedPseudoGroup.id"
        :group="allSelectedPseudoGroup"
        :selected-groups="pseudoGroupModelValue"
        :filter="groupFilter"
        @toggle-group="onToggleSelectAll"
      />

      <MultiGroupPickerElement
        v-for="group in allGroups"
        :key="group.id"
        :group="group"
        :selected-groups="modelValue"
        :filter="groupFilter"
        :force-open="!!groupFilter.length"
        @toggle-group="onToggleGroup"
      />
    </ul>
  </template>
</template>
<script>
import LoaderSimple from '@/components/base/loader/LoaderSimple.vue'
import throttle from 'lodash/throttle'
import MultiGroupPickerElement from './MultiGroupPickerElement.vue'
import { getHierarchyGroups } from '@/api/groups.service.ts'
import FilterValue from '@/components/search/Filters/FilterValue.vue'
import FilterSearchInput from '@/components/search/Filters/FilterSearchInput.vue'
import useOrganizationsStore from '@/stores/useOrganizations.ts'
export default {
  name: 'MultiGroupPicker',

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
    hasPublicField: {
      type: Boolean,
      default: false,
    },
    isPublic: {
      type: Boolean,
      default: false,
    },
  },

  emits: ['update:modelValue', 'update:isPublic'],

  setup() {
    const organizationsStore = useOrganizationsStore()
    return {
      organizationsStore,
    }
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
        '-1': !this.isPublic && (!values.length || !values.some((value) => value)),
      }
    },

    publicPseudoGroup() {
      return {
        id: -1,
        name: this.$t('event.form.people_groups.public'),
        children: [],
        disabled: this.publicPseudoGroupModelValue['-1'],
      }
    },

    publicPseudoGroupModelValue() {
      return {
        '-1': this.isPublic,
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
      this.allGroups = (await getHierarchyGroups(this.organizationsStore.current.code)).children
    },
    onToggleGroup(group) {
      const groups = {
        ...this.modelValue,
        [group.id]: !this.modelValue[group.id],
      }
      this.$emit('update:modelValue', groups)
      this.$nextTick(() => this.$emit('update:isPublic', false))
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
        this.$nextTick(() => this.$emit('update:isPublic', false))
      }
    },

    onTogglePublic() {
      if (!this.publicPseudoGroupModelValue['-1']) {
        const groups = {
          ...this.modelValue,
        }
        for (let key of Object.keys(groups)) {
          groups[key] = false
        }

        this.$emit('update:modelValue', groups)
        this.$nextTick(() => this.$emit('update:isPublic', true))

        // TODO set to true or somthing ?
        // this.pseudoGroupModelValue['-1']
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
  flex-wrap: wrap;
  gap: $space-m;
  margin-bottom: $space-m;
}

.group-filter {
  width: 100%;
}
</style>
