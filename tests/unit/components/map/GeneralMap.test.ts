import { lpiMount } from '@/../tests/helpers/LpiMount'
import GeneralMap from '@/components/map/GeneralMap.vue'
import { LocationGeneral } from '@/interfaces/maps'
import { flushPromises } from '@vue/test-utils'
import { delay } from 'es-toolkit'

import { beforeEach, describe, expect, it, vi } from 'vitest'

describe('GeneralMap', () => {
  it('should render GeneralMap component', () => {
    const props = {
      locations: [],
    }
    const wrapper = lpiMount(GeneralMap, { props })

    expect(wrapper.exists()).toBeTruthy()
  })

  it('render maps control', async () => {
    const props = {
      locations: [],
      controls: true,
    }
    let wrapper = lpiMount(GeneralMap, { props })
    await flushPromises()
    expect(wrapper.find('[data-test="map-control"]').exists()).toBeTruthy()
    expect(wrapper.find('[data-test="map-control-zoom"]').exists()).toBeTruthy()
    expect(wrapper.find('[data-test="map-control-expand"]').exists()).toBeTruthy()

    wrapper = lpiMount(GeneralMap, { props: { ...props, controls: false } })
    await flushPromises()
    expect(wrapper.find('[data-test="map-control"]').exists()).toBeFalsy()
    expect(wrapper.find('[data-test="map-control-zoom"]').exists()).toBeFalsy()
    expect(wrapper.find('[data-test="map-control-expand"]').exists()).toBeFalsy()

    wrapper = lpiMount(GeneralMap, { props: { ...props, controlExpand: false } })
    await flushPromises()
    expect(wrapper.find('[data-test="map-control"]').exists()).toBeTruthy()
    expect(wrapper.find('[data-test="map-control-expand"]').exists()).toBeFalsy()

    wrapper = lpiMount(GeneralMap, { props: { ...props, controlZoom: false } })
    await flushPromises()
    expect(wrapper.find('[data-test="map-control"]').exists()).toBeTruthy()
    expect(wrapper.find('[data-test="map-control-zoom"]').exists()).toBeFalsy()
  })

  it('render marker', async () => {
    const props = {
      locations: [
        {
          id: 44,
          lat: 66.88,
          lng: 44.99,
          title: 'title-project',
          description: 'description-project',
          content_type: 'project',
          content_id: '66',
          type: 'team',
        },
        {
          id: 45,
          lat: 66.88,
          lng: 44.99,
          title: 'title-people_group',
          description: 'description-people_group',
          content_type: 'people_group',
          content_id: '66',
          type: 'address',
        },
        {
          id: 46,
          lat: 66.88,
          lng: 44.99,
          title: 'title-event',
          description: 'description-event',
          content_type: 'event',
          content_id: '66',
          type: 'event',
        },
        {
          id: 47,
          lat: 66.88,
          lng: 44.99,
          title: 'title-news',
          description: 'description-news',
          content_type: 'news',
          content_id: '66',
          type: 'news',
        },
      ] as LocationGeneral[],
    }
    const wrapper = lpiMount(GeneralMap, { props })
    await flushPromises()

    // 4 from props + 1 "hidden"
    expect(wrapper.findAll('[data-test^=marker-icon-]').length).toEqual(5)
  })

  it('render dynamic marker', async () => {
    const props = {
      locations: [
        {
          id: 44,
          lat: 66.88,
          lng: 44.99,
          title: 'title-project',
          description: 'description-project',
          content_type: 'project',
          content_id: '66',
          type: 'team',
        },
        {
          id: 45,
          lat: 66.88,
          lng: 44.99,
          title: 'title-people_group',
          description: 'description-people_group',
          content_type: 'people_group',
          content_id: '66',
          type: 'address',
        },
        {
          id: 46,
          lat: 66.88,
          lng: 44.99,
          title: 'title-event',
          description: 'description-event',
          content_type: 'event',
          content_id: '66',
          type: 'event',
        },
        {
          id: 47,
          lat: 66.88,
          lng: 44.99,
          title: 'title-news',
          description: 'description-news',
          content_type: 'news',
          content_id: '66',
          type: 'news',
        },
      ] as LocationGeneral[],
      markerDynamic: true,
    }
    const wrapper = lpiMount(GeneralMap, { props })
    await flushPromises()

    // is 4 , no "hidden" marker for markerDynamic=true
    expect(wrapper.findAll('[data-test^=marker-icon-]').length).toEqual(4)
  })
})
