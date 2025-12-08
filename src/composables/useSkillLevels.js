import { computed } from 'vue'

export default function useSkillLevels() {
  const { t } = useNuxtI18n()
  const skillLevels = computed(() =>
    // CAUTION : this must be ordered from lowest to highest (see clampLevel())
    [
      {
        label: t('profile.edit.skills.levels.curious'),
        value: 1,
      },
      {
        label: t('profile.edit.skills.levels.basic'),
        value: 2,
      },
      {
        label: t('profile.edit.skills.levels.competent'),
        value: 3,
      },
      {
        label: t('profile.edit.skills.levels.expert'),
        value: 4,
      },
    ]
  )

  function clampLevel(level) {
    const levels = skillLevels.value
    const min = levels[0].value
    const max = levels[levels.length - 1].value
    return Math.min(Math.max(level, min), max)
  }

  return { skillLevels, clampLevel }
}
