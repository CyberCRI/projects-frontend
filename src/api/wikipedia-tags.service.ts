import { axios } from '@/api/api.config'
import { APIResponseList } from '@/api/types'
import { WikipediaTagOutput, TagParams, GetWikiTagResponse } from '@/models/wikipedia-tag.model'
import useLanguagesStore from '@/stores/useLanguages'

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
    const languagesStore = useLanguagesStore()
    const lang = languagesStore.current
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
    const languagesStore = useLanguagesStore()
    const lang = languagesStore.current
    return (
        await axios.get(`${import.meta.env.VITE_APP_API_DEFAULT_VERSION}/wikibase-item/`, {
            params: { query: search, language: lang, limit: 100, offset: 0 },
        })
    ).data
}

export async function wikiAutocomplete(search: string): Promise<WikipediaTagOutput[]> {
    const languagesStore = useLanguagesStore()
    const lang = languagesStore.current
    return (
        await axios.get(
            `${import.meta.env.VITE_APP_API_DEFAULT_VERSION}/wikibase-item/autocomplete/`,
            {
                params: { query: search, language: lang, limit: 10, offset: 0 },
            }
        )
    ).data
}
