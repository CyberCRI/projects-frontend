import { lpiShallowMount } from '../../../helpers/LpiMount'
import GroupCard from '@/components/peopleKit/GroupCard.vue'
import { ProjectOutputFactory } from '../../../factories/project.factory'

import { afterEach, beforeEach, describe, expect, it, vi, Mock } from 'vitest'
//TODO : add once model created
//import { GroupFactory } from '../../../factories/group.factory'

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
