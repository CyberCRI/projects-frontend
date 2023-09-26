import { SdgModel } from '@/models/sdg.model'

const sdgs = [
    {
        id: 1,
        background_color: '#e5243b',
    },
    {
        id: 2,
        background_color: '#dda63a',
    },
    {
        id: 3,
        background_color: '#4c9f38',
    },
    {
        id: 4,
        background_color: '#c5192d',
    },
    {
        id: 5,
        background_color: '#ff3a21',
    },
    {
        id: 6,
        background_color: '#26bde2',
    },
    {
        id: 7,
        background_color: '#fcc30b',
    },
    {
        id: 8,
        background_color: '#a21942',
    },
    {
        id: 9,
        background_color: '#fd6925',
    },
    {
        id: 10,
        background_color: '#dd1367',
    },
    {
        id: 11,
        background_color: '#fd9d24',
    },
    {
        id: 12,
        background_color: '#bf8b2e',
    },
    {
        id: 13,
        background_color: '#3f7e44',
    },
    {
        id: 14,
        background_color: '#0a97d9',
    },
    {
        id: 15,
        background_color: '#56c02b',
    },
    {
        id: 16,
        background_color: '#00689d',
    },
    {
        id: 17,
        background_color: '#19486a',
    },
]

export interface SdgState {
    all: SdgModel[]
}

const state = (): SdgState => ({
    all: sdgs,
})

const getters = {
    all: (state: SdgState) => state.all,
    byIdList: (state: SdgState) => (idList) => {
        const matchingSdgs = []
        for (const id of idList) {
            matchingSdgs.push(...state.all.filter((sdg) => sdg.id === parseInt(id)))
        }

        return matchingSdgs
    },
}

export default {
    namespaced: true,
    state,
    getters,
}
