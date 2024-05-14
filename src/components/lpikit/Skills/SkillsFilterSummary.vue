<template>
    <div>
        <CurrentTags :current-tags="skills" @remove-tag="removeSkill" />
    </div>
</template>

<script>
import CurrentTags from '@/components/lpikit/FilterTags/CurrentTags.vue'

export default {
    name: 'SkillsFilterSummary',

    emits: ['update:modelValue'],

    components: {
        CurrentTags,
    },

    props: {
        modelValue: {
            type: Array,
            default: () => [],
        },
    },

    data() {
        return {
            skills: [],
        }
    },

    methods: {
        removeSkill(skill) {
            const skillsIndex = this.skills.findIndex(
                (element) => element.id === skill.id && element.name === skill.name
            )
            this.skills.splice(skillsIndex, 1)
            this.$emit('update:modelValue', this.skills)
        },
    },

    watch: {
        modelValue: {
            handler: function (neo, old) {
                if (neo && neo != old) this.skills = [...this.modelValue]
            },
            immediate: true,
            deep: true,
        },
    },
}
</script>

<style lang="scss" scoped>
.tag-search-title {
    text-align: center;
    font-size: $font-size-2xl;
    font-weight: 700;
    margin: pxToRem(46px) auto;
}

.search-input-ctn {
    margin-bottom: 24px;
}
</style>

<style lang="scss">
.input-ctn {
    width: 100%;

    label {
        align-self: flex-start;
    }

    input {
        width: 100%;
    }
}

.add-modal .s-modal-wrapper .s-modal-content {
    max-height: 526px;
}

.search-modal .s-modal-wrapper .s-modal-content {
    max-height: 660px;
}

.tag-search-label {
    font-size: $font-size-m;
    color: $primary-dark;
    font-weight: 700;
    margin: 0 0 $space-s $space-l;
}
</style>
