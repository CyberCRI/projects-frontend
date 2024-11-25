<template>
    <div>
        <div class="columns-wrapper" :class="`layout-${columnCount.length}-columns`">
            <div
                v-for="column in columnCount"
                :key="`column-${column}`"
                class="column"
                :class="[`column-${column}`]"
            >
                <h3 v-if="title && column === 0" class="title">{{ title }}</h3>

                <template v-for="(skill, idx) in visibleSkills">
                    <SkillItem
                        v-if="(idx + idxOffset) % columnCount.length == column"
                        :key="skill.id"
                        :label="skillTexts.title(skill)"
                        :description="skillTexts.description(skill)"
                        :level="Number(skill.level)"
                    />
                </template>
            </div>
        </div>
    </div>
</template>

<script>
import SkillItem from '@/components/people/skill/SkillItem.vue'
import useSkillTexts from '@/composables/useSkillTexts.js'

export default {
    name: 'UserSkills',

    components: { SkillItem },

    setup() {
        const skillTexts = useSkillTexts()
        return { skillTexts }
    },

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
    },

    mounted() {
        window.addEventListener('resize', this.onResize)
        this.onResize()
    },

    unmounted() {
        window.removeEventListener('resize', this.onResize)
    },

    computed: {
        visibleSkills() {
            return this.fullList ? this.skills : this.skills.slice(0, this.limit)
        },
        idxOffset() {
            // if we have a title, it take the place of the first skill
            // so this is used to offset skill indexes in computations
            return this.title ? 1 : 0
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

            // if there's more column than skills, delete extraneous
            if (this.columnCount.length > this.skills.length + this.idxOffset) {
                for (
                    let i = this.skills.length + this.idxOffset;
                    i < this.columnCount.length;
                    i++
                ) {
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

.layout-1-columns .column {
    flex-basis: 100%;
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
    gap: $space-m;
    background-color: $primary-lighter;
    padding: pxToRem(24px) pxToRem(32px);
    border-radius: $border-radius-l;
    align-items: stretch;
}

.column-empty {
    opacity: 0;
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
