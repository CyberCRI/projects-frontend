import store from '@/store'
import { axios } from '@/api/api.config'
import { APIResponseList } from '@/api/types'
import { WikipediaTagOutput, TagParams, GetWikiTagResponse } from '@/models/wikipedia-tag.model'

export async function getWikiTag(id: number): Promise<WikipediaTagOutput> {
    return (await axios.get(`${import.meta.env.VITE_APP_API_DEFAULT_VERSION}/wikipedia-tag/${id}/`))
        .data
}

export async function getAllWikiTags(
    params: TagParams
): Promise<APIResponseList<WikipediaTagOutput>> {
    return (
        await axios.get(`${import.meta.env.VITE_APP_API_DEFAULT_VERSION}/wikipedia-tag/`, {
            params,
        })
    ).data
}

export async function getWikiTagDisambiguate(pageid: string): Promise<GetWikiTagResponse> {
    const lang = store.state.languages.current
    return (
        await axios.get(
            `${
                import.meta.env.VITE_APP_API_DEFAULT_VERSION
            }/wikipedia-tag/wikipedia/disambiguate/${pageid}/`,
            {
                params: { lang: lang },
            }
        )
    ).data[lang]
}

export async function searchWikiTags(search: string): Promise<WikipediaTagOutput[]> {
    const lang = store.state.languages.current
    return (
        await axios.get(
            `${import.meta.env.VITE_APP_API_DEFAULT_VERSION}/wikipedia-tag/wikipedia/`,
            {
                params: { q: search, lang: lang },
            }
        )
    ).data[lang]
}
