<template>
    <div class="loader-ctn" v-if="loading">
        <LoaderSimple />
    </div>
    <form v-else>
        <div class="form-section">
            <label>{{ $t('event.form.name.label') }}</label>
            <TextInput
                input-type="text"
                label=""
                v-model="modelValue.name"
                :placeholder="$t('event.form.name.placeholder')"
            />
        </div>
        <div class="form-section">
            <label>{{ $t('event.form.information.label') }}</label>
            <TextInput
                input-type="textarea"
                label=""
                v-model="modelValue.information"
                :placeholder="$t('event.form.information.placeholder')"
            />
        </div>
        <div class="form-section">
            <label>{{ $t('event.form.date.label') }}</label>
            <button type="button" @click="showDatePicker = true" class="validity-type-btn">
                <IconImage class="icon" name="Calendar" />
                {{ $t('invitation.create.field.validity.pick-date') }}
            </button>

            <span class="date-preview" v-if="modelValue.date">{{ displayedDate }}</span>
            <VueDatePicker
                v-show="showDatePicker"
                :on-click-outside="() => (showDatePicker = false)"
                :inline="true"
                :auto-apply="true"
                :model-value="modelValue.date"
                :enable-time-picker="false"
                @update:model-value="onDateSelected"
            />
        </div>
        <div class="form-section">
            <label>{{ $t('event.form.groups.label') }}</label>
            <p class="notice">{{ $t('event.form.groups.notice') }}</p>

            <div class="selected-groups">
                <template
                    v-for="[groupId, isSelected] in Object.entries(modelValue.groups)"
                    :key="groupId"
                >
                    <FilterValue
                        v-if="isSelected"
                        :label="groupIndex[groupId]"
                        icon="Close"
                        @click="onToggleGroup({ id: groupId })"
                    />
                </template>
            </div>

            <EventGroupsElement
                v-for="group in allGroups"
                :key="group.id"
                :group="group"
                :selected-groups="modelValue.groups"
                @toggle-group="onToggleGroup"
            />
        </div>
    </form>
</template>
<script>
import TextInput from '@/components/lpikit/TextInput/TextInput.vue'
import VueDatePicker from '@vuepic/vue-datepicker'
import LpiButton from '@/components/lpikit/LpiButton/LpiButton.vue'
import IconImage from '@/components/svgs/IconImage.vue'
import { helpers, required } from '@vuelidate/validators'
import '@vuepic/vue-datepicker/dist/main.css'
import { getHierarchyGroups } from '@/api/group.service.ts'
import EventGroupsElement from './EventGroupsElement.vue'
import FilterValue from '@/components/peopleKit/Filters/FilterValue.vue'
import LoaderSimple from '@/components/lpikit/Loader/LoaderSimple.vue'
export default {
    name: 'EventForm',
    components: {
        TextInput,
        VueDatePicker,
        LpiButton,
        IconImage,
        EventGroupsElement,
        FilterValue,
        LoaderSimple,
    },

    props: {
        modelValue: {
            type: Object,
            required: true,
        },
    },

    data() {
        return {
            showDatePicker: false,
            allGroups: [],
            groupIndex: {},
            loading: false,
        }
    },
    computed: {
        displayedDate() {
            return this.modelValue.date ? new Date(this.modelValue.date).toLocaleDateString() : ''
        },
    },
    async mounted() {
        this.loading = true
        await this.loadGroups()
        this.buildIndex(this.allGroups)
        this.loading = false
    },
    methods: {
        onDateSelected(modelData) {
            this.modelValue.date = modelData
            this.showDatePicker = false
        },
        async loadGroups() {
            this.allGroups = (
                await getHierarchyGroups(this.$store.state.organizations.current.code)
            ).children
        },
        onToggleGroup(group) {
            this.modelValue.groups[group.id] = !this.modelValue.groups[group.id]
        },
        buildIndex(groupList) {
            groupList.forEach((group) => {
                this.groupIndex[group.id] = group.name
                if (group.children) {
                    this.buildIndex(group.children)
                }
            })
        },
    },
}
</script>
<style lang="scss" scoped>
.loader-ctn {
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 5rem 0;
}
.validity-type-btn {
    padding: $space-s;
    background-color: $white;
    border: $border-width-s solid $primary-dark;
    border-radius: $border-radius-s;
    vertical-align: middle;
    display: inline-flex;
    align-items: center;
    gap: $space-m;
    color: $primary-dark;
    font-weight: 700;

    & + .validity-type-btn {
        margin-left: $space-unit;
    }

    .icon {
        width: $font-size-2xl;
        fill: $primary-dark;
    }
}

.form-section + .form-section {
    margin-top: $space-xl;
}

label {
    font-size: 0.875rem;
    font-weight: bold;
    color: #000;
    display: block;
}

label,
.notice {
    margin-bottom: $space-l !important;
}

.date-preview {
    margin-left: $space-l;
    display: inline-block;
    font-size: 1.2rem;
}

.selected-groups {
    display: flex;
    gap: $space-m;
    margin-bottom: $space-m;
}
</style>
