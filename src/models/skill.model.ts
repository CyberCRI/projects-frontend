export interface SkillModel {
    id: number
    user: string
    wikipedia_tag: {
        wikipedia_qid: string
        name: string
    }
    level: number
    level_to_reach: number
}
