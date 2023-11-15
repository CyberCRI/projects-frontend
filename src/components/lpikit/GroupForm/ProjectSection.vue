<template>
    <div class="team-section">
        <label>
            <span class="section-title">
                {{ $filters.capitalize($t('group.form.project-label')) }}
                <span v-if="modelValue.length">({{ modelValue.length }})</span>
            </span>
            <span class="add-user-card" @click="drawerIsOpen = true">
                <IconImage v-if="!modelValue.length" name="Plus" />
                <IconImage v-else name="Pen" />
                <span v-if="!modelValue.length">{{
                    $filters.capitalize($t('group.form.add'))
                }}</span>
                <span v-else>{{ $filters.capitalize($t('group.form.edit')) }}</span>
            </span>
        </label>

        <div v-if="modelValue.length" class="team-grid">
            <ProjectCard
                v-for="project in showFullList ? modelValue : shortList"
                :key="project.id"
                :has-close-icon="true"
                :project="project"
                class="selected-card"
                @unselect="onRemoveProject(project)"
            />
        </div>
        <div class="show-more">
            <LinkButton
                v-if="shortList?.length < modelValue?.length"
                class="see-more-btn"
                :label="$filters.capitalize($t(seeMoreLabel))"
                @click="showFullList = !showFullList"
            />
        </div>

        <PickProjectsDrawer
            v-if="drawerIsOpen"
            :is-opened="drawerIsOpen"
            :pre-selected-projects="modelValue"
            @close="drawerIsOpen = false"
            @picked-projects="onProjectsPicked"
            :title="$t('group.form.add-projects')"
        />
    </div>
</template>

<script>
import PickProjectsDrawer from '@/components/lpikit/PickProjectsDrawer/PickProjectsDrawer.vue'
import IconImage from '@/components/svgs/IconImage.vue'
import ProjectCard from '@/components/peopleKit/ProjectCard.vue'
import LinkButton from '@/components/lpikit/LpiButton/LinkButton.vue'

export default {
    name: 'ProjectSection',

    emits: ['update:model-value'],

    components: {
        ProjectCard,
        PickProjectsDrawer,
        IconImage,
        LinkButton,
    },

    props: {
        modelValue: {
            type: Array,
            default: () => [],
        },
    },

    data() {
        return {
            drawerIsOpen: false,
            showFullList: false,
            isSeeMore: true,
        }
    },
    computed: {
        shortList() {
            return this.modelValue.slice(0, 8)
        },
        seeMoreLabel() {
            return this.showFullList ? 'common.see-less' : 'common.see-more'
        },
    },

    methods: {
        onProjectsPicked(projects) {
            this.$emit('update:model-value', [...projects])
        },

        onRemoveProject(project) {
            const projects = this.modelValue.filter((p) => p.id !== project.id)
            this.$emit('update:model-value', [...projects])
        },
    },
}
</script>

<style lang="scss" scoped>
.team-section {
    label {
        display: flex;
        justify-content: space-between;
        align-items: center;
        flex-direction: row;
        width: 100%;
        font-size: $font-size-m;
        margin-bottom: $space-l;

        .section-title {
            color: $black;
            font-weight: bold;
            display: block;
        }
    }

    .team-grid {
        display: grid;
        grid-template-columns: 1fr 1fr;
        justify-items: stretch;
        gap: $space-l;
    }

    .add-user-card {
        display: inline-flex;
        justify-content: center;
        align-items: center;
        background: $white;
        color: $primary-dark;
        cursor: pointer;
        font-weight: 700;
        font-size: 16px;

        svg {
            width: 18px;
            fill: $primary-dark;
        }
    }

    .disabled {
        color: $gray-6;

        svg {
            width: 18px;
            fill: $gray-6;
        }
    }

    .show-more {
        display: flex;
        justify-content: center;
        margin-top: $space-l;
    }
}
</style>
