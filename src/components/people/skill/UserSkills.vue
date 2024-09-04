<template>
    <div>
        <div
            class="columns-wrapper"
            :class="{
                [`layout-${columnCount.length}-columns`]: true,
                'has-mentor-column': fullList && hasMentorRelatedSkills,
            }"
        >
            <div class="column mentor-column" v-if="hasMentorRelatedSkills">
                <div class="mentor-column-block" v-if="mentorSkills.length">
                    <h3 class="mentor-column-title">
                        <IconImage name="School" /> {{ $t('Mentor') }}
                    </h3>
                    <template v-for="skill in mentorSkills" :key="skill.id">
                        <SkillItem
                            :is-editable="isEditable"
                            white
                            :label="skill.wikipedia_tag.name"
                            :level="Number(skill.level)"
                            :comment="skill.comment"
                            @edit-skill="$emit('edit-skill', skill)"
                            @delete-skill="$emit('delete-skill', skill)"
                        />
                    </template>
                    <div class="mentorship-action">
                        <IconImage name="EmailOutline" /> {{ $t('Ask for mentorship') }}
                    </div>
                </div>
                <div class="mentor-column-block" v-if="mentoreeSkills.length">
                    <h3 class="mentor-column-title">
                        <IconImage name="HumanMaleChild" /> {{ $t('Mentoree') }}
                    </h3>
                    <template v-for="skill in mentoreeSkills" :key="skill.id">
                        <SkillItem
                            :is-editable="isEditable"
                            white
                            :label="skill.wikipedia_tag.name"
                            :level="Number(skill.level)"
                            :comment="skill.comment"
                            @edit-skill="$emit('edit-skill', skill)"
                            @delete-skill="$emit('delete-skill', skill)"
                        />
                    </template>
                    <div class="mentorship-action">
                        <IconImage name="EmailOutline" /> {{ $t('Offer your mentorship') }}
                    </div>
                </div>
            </div>

            <div
                v-for="column in nonMentorColumnCount"
                :key="`column-${column}`"
                class="column"
                :class="[`column-${column}`]"
            >
                <h3 v-if="title && column === 0" class="title">{{ title }}</h3>

                <template v-for="(skill, idx) in nonMentorSkills">
                    <SkillItem
                        v-if="(idx + idxOffset) % nonMentorColumnCount.length == column"
                        :is-editable="isEditable"
                        :key="skill.id"
                        :label="skill.wikipedia_tag.name"
                        :level="Number(skill.level)"
                        @edit-skill="$emit('edit-skill', skill)"
                        @delete-skill="$emit('delete-skill', skill)"
                    />
                </template>
            </div>
        </div>
    </div>
</template>

<script>
import SkillItem from '@/components/people/skill/SkillItem.vue'
import IconImage from '@/components/base/media/IconImage.vue'
export default {
    name: 'UserSkills',

    emits: ['edit-skill', 'delete-skill'],

    components: { SkillItem, IconImage },

    data() {
        return {
            columnCount: [0],
        }
    },

    props: {
        skills: {
            type: Array,
            required: true,
        },

        fullList: {
            // wheter to
            // - display all skills on several columns (true)
            // - or only the first 9 on one column (false)
            type: Boolean,
            default: false,
        },

        limit: {
            // max number of skills to display in not in fullList mode
            type: Number,
            default: 9,
        },

        title: {
            type: String,
            default: '',
        },

        isEditable: {
            type: Boolean,
            default: false,
        },
    },

    mounted() {
        window.addEventListener('resize', this.onResize)
        this.onResize()
    },

    unmounted() {
        window.removeEventListener('resize', this.onResize)
    },

    computed: {
        idxOffset() {
            // if we have a title, it take the place of the first skill
            // so this is used to offset skill indexes in computations
            return this.title ? 1 : 0
        },

        mentorSkills() {
            if (!this.fullList) return []
            return this.skills.filter((skill) => skill.can_mentor)
        },

        mentoreeSkills() {
            if (!this.fullList) return []
            return this.skills.filter((skill) => skill.needs_mentor)
        },

        nonMentorSkills() {
            if (!this.fullList) return this.skills.slice(0, this.limit)
            return this.skills.filter((skill) => !skill.can_mentor && !skill.needs_mentor)
        },

        hasMentorRelatedSkills() {
            return this.mentorSkills.length || this.mentoreeSkills.length
        },

        nonMentorColumnCount() {
            const res = [...this.columnCount]
            if (res.length > 1 && this.fullList && this.hasMentorRelatedSkills) res.pop()
            return res
        },
    },

    methods: {
        onResize() {
            const w = window.innerWidth
            // compute columns count according to available space and diplay mode (fullList)
            // the number in the arrays serve to spread the skills in the columns (according to their index modulo column length)
            if (w >= 1200) {
                this.columnCount = this.fullList ? [0, 1, 2] : [0]
            } else if (w >= 768) {
                this.columnCount = this.fullList ? [0, 1] : [0]
            } else {
                this.columnCount = [0]
            }

            let skills =
                this.fullList && this.hasMentorRelatedSkills ? this.nonMentorSkills : this.skills

            // if there's more column than skills, delete extraneous
            if (this.columnCount.length > skills.length + this.idxOffset) {
                for (let i = skills.length + this.idxOffset; i < this.columnCount.length; i++) {
                    // hack column class name to hide it
                    this.columnCount[i] = 'empty'
                }
            }
        },
    },
}
</script>

<style lang="scss" scoped>
.columns-wrapper {
    margin-top: $space-2xl;
    display: flex;
    gap: pxToRem(31px);
}

.layout-1-columns {
    &.has-mentor-column {
        flex-direction: column;
    }

    .column {
        flex-basis: 100%;
    }
}

.layout-2-columns .column {
    flex-basis: 50%;
}

.layout-3-columns .column {
    flex-basis: 33.33%;
}

.column {
    display: flex;
    flex-flow: column;
    gap: 0;
    background-color: $primary-lighter;
    padding: pxToRem(24px) pxToRem(12px);
    border-radius: $border-radius-l;
    align-items: stretch;
}

.mentor-column {
    background-color: $primary-dark;
    color: $white;

    .mentorship-action,
    .mentor-column-title {
        display: flex;
        align-items: center;
        gap: 1rem;

        svg {
            fill: $white;
            width: 1.2em;
            height: 1.2em;
        }
    }

    .mentorship-action {
        justify-content: flex-end;
    }

    .mentor-column-block {
        display: flex;
        flex-flow: column;
        align-items: stretch;

        & ~ .mentor-column-block {
            margin-top: $space-m;
            padding-top: $space-m;
            border-top: 1px solid $white;
        }
    }
}

.column-empty {
    opacity: 0;
}

.title {
    color: $primary-dark;
    font-size: $font-size-l;
    text-transform: uppercase;
    padding-bottom: pxToRem(10px);
    padding-top: pxToRem(8px);
}

.s-button {
    margin: $space-l auto 0;
}
</style>
