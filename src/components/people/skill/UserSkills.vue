<template>
  <div>
    <div v-if="title" class="title-wrapper">
      <h3 class="title">
        {{ title }}
      </h3>
      <SkillLevelTip>
        <LinkButton
          :label="$t(`me.levels-help-link`)"
          btn-icon="HelpCircle"
          data-test="skill-levels-help-button"
        />
      </SkillLevelTip>
    </div>
    <div class="columns-wrapper" :class="`layout-${columnCount.length}-columns`">
      <div
        v-for="column in columnCount"
        :key="`column-${column}`"
        class="column"
        :class="[`column-${column}`]"
      >
        <template v-for="(skill, idx) in visibleSkills">
          <SkillItem
            v-if="
              column != 'empty' &&
              skillsPerColumn[column].from <= idx &&
              idx < skillsPerColumn[column].to
            "
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
import SkillLevelTip from '@/components/people/skill/SkillLevelTip.vue'
import LinkButton from '@/components/base/button/LinkButton.vue'

export default {
  name: 'UserSkills',

  components: { SkillItem, LinkButton, SkillLevelTip },

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

  setup() {
    const skillTexts = useSkillTexts()
    return { skillTexts }
  },

  data() {
    return {
      columnCount: [0],
    }
  },

  computed: {
    visibleSkills() {
      return this.fullList ? this.skills : this.skills.slice(0, this.limit)
    },
    skillsPerColumn() {
      const res = []
      let remaining = this.visibleSkills.length
      let from = 0
      for (let i = 0; i < this.columnCount.length; i++) {
        let count = Math.ceil(remaining / (this.columnCount.length - res.length))
        let to = from + count
        res.push({ from, to })
        from += count
        remaining -= count
      }
      return res
    },
  },

  mounted() {
    window.addEventListener('resize', this.onResize)
    this.onResize()
  },

  unmounted() {
    window.removeEventListener('resize', this.onResize)
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
      if (this.columnCount.length > this.skills.length) {
        for (let i = this.skills.length; i < this.columnCount.length; i++) {
          // hack column class name to hide it
          this.columnCount[i] = 'empty'
        }
      }
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

.columns-wrapper {
  margin-top: $space-2xl;
  display: flex;
  gap: $column-spacing;
}

.title-wrapper + .columns-wrapper {
  margin-top: $space-l;
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
  padding: pxToRem(24px) $column-spacing;
  border-radius: $border-radius-l;
  align-items: stretch;
}

.column-empty {
  opacity: 0;
}

.s-button {
  margin: $space-l auto 0;
}
</style>
