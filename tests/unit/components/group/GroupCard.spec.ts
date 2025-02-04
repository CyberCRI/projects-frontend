import { lpiShallowMount } from '@/../tests/helpers/LpiMount'
import GroupCard from '@/components/group/GroupCard.vue'
import { ProjectOutputFactory } from '@/../tests/factories/project.factory'

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import type { Mock } from 'vitest'
//TODO : add once model created
//import { GroupFactory } from '@/../tests/factories/group.factory'

describe('GroupCard', () => {
    let wrapper
    let defaultParams

    beforeEach(() => {
        defaultParams = {
            props: {
                //todo: use group factory
                group: ProjectOutputFactory.generate(),
            },
        }
    })

    it('should render GroupCard component', () => {
        wrapper = lpiShallowMount(GroupCard, defaultParams)

        expect(wrapper.exists()).toBeTruthy()
    })
})
