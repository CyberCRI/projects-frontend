import type { NewsInput, NewsModel } from '@/models/news.model'
import useAPI from '@/composables/useAPI'

export async function getAllNews(orgCode: string, config = {}) {
  return await useAPI<PaginationResult<NewsModel>>(`organization/${orgCode}/news/`, config)
}

export async function getNews(orgCode: string, idOrSlug: number | string, config = {}) {
  return await useAPI<NewsModel>(`organization/${orgCode}/news/${idOrSlug}/`, config)
}

export async function createNews(orgCode: string, body: NewsInput) {
  return await useAPI<NewsModel>(`organization/${orgCode}/news/`, { body, method: 'POST' }) //.data.value
}

export async function putNews(orgCode: string, idOrSlug: number | string, body: NewsInput) {
  return await useAPI<NewsModel>(`organization/${orgCode}/news/${idOrSlug}/`, {
    body,
    method: 'PUT',
  }) //.data.value
}

export async function patchNews(orgCode: string, idOrSlug: number | string, body: NewsInput) {
  return await useAPI<NewsModel>(`organization/${orgCode}/news/${idOrSlug}/`, {
    body,
    method: 'PATCH',
  })
  //.data.value
}

export async function deleteNews(orgCode: string, idOrSlug: number | string) {
  return await useAPI(`organization/${orgCode}/news/${idOrSlug}/`, { method: 'DELETE' }) // .value.data
}

export async function postNewsHeader(orgCode: string, idOrSlug: number | string, body) {
  return await useAPI(`organization/${orgCode}/news/${idOrSlug}/header/`, {
    body,
    method: 'POST',
  }) //.data.value
}

export async function patchNewsHeader(orgCode: string, idOrSlug: number | string, image_id, body) {
  return await useAPI(`organization/${orgCode}/news/${idOrSlug}/header/${image_id}/`, {
    body,
    method: 'PATCH',
  }) //.data.value
}
