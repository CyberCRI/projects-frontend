import TagChart from '~/components/stats/Charts/TagChart.vue'
import { lpiShallowMount } from '~~/tests/helpers/LpiMount'

import type { Stats } from 'shared-projects-frontend/models'
import TagFactory from '~~/tests/factories/tag.factory'
import { describe, expect, it } from 'vitest'
describe('TagChart.vue', () => {
  it('should render component', () => {
    const stats: Stats['top_tags'] = TagFactory.generateMany(10).map((tag) => {
      return {
        ...tag,
        project_count: 284,
        projects: ['1', '2', '3', '4'],
      }
    })

    const wrapper = lpiShallowMount(TagChart, {
      props: {
        stats,
      },
    })
    expect(wrapper.exists()).toBe(true)
  })
})
