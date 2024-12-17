<template>
    <div>
        <div v-if="title" class="title-wrapper">
            <h3 class="title">{{ title }}</h3>
            <SkillLevelTip>
                <LinkButton
                    :label="$t(`me.levels-help-link`)"
                    btn-icon="HelpCircle"
                    data-test="skill-levels-help-button"
                />
            </SkillLevelTip>
        </div>
        <div class="columns-wrapper">
            <SkillItemFull v-for="skill in skills" :key="skill.id" :skill="skill" />
        </div>
    </div>
</template>

<script>
import SkillItemFull from '@/components/people/skill/SkillItemFull.vue'
import SkillLevelTip from '@/components/people/skill/SkillLevelTip.vue'
import LinkButton from '@/components/base/button/LinkButton.vue'

export default {
    name: 'UserSkillsFull',

    components: { SkillItemFull, LinkButton, SkillLevelTip },

    props: {
        skills: {
            type: Array,
            required: true,
        },

        title: {
            type: String,
            default: '',
        },
    },
}
</script>

<style lang="scss" scoped>
$column-spacing: pxToRem(32px);

.title-wrapper {
    padding-left: $column-spacing;
    margin-top: 1rem;
    display: flex;
    justify-content: space-between;
    gap: 1rem;
}

.title {
    color: $primary-dark;
    font-size: $font-size-l;
    text-transform: uppercase;
}

.s-button {
    margin: $space-l auto 0;
}
</style>
