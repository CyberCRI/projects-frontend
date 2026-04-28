import type { NewsInput, NewsModel, QueryFilterNews } from '~/models/news.model'
import useAPI, { UseApiOptions } from '~/composables/useAPI'
import { OrganizationModel } from '~/models/organization.model'

type ConfigNews = UseApiOptions<QueryFilterNews>

export async function getAllNews(
  organizationCode: OrganizationModel['code'],
  config: ConfigNews = {}
) {
  return await useAPI<PaginationResult<NewsModel>>(`organization/${organizationCode}/news/`, config)
}

export async function getNews(
  organizationCode: OrganizationModel['code'],
  newsId: NewsModel['id'],
  config: ConfigNews = {}
) {
  return await useAPI<NewsModel>(`organization/${organizationCode}/news/${newsId}/`, config)
}

export async function createNews(organizationCode: OrganizationModel['code'], body: NewsInput) {
  return await useAPI<NewsModel>(`organization/${organizationCode}/news/`, { body, method: 'POST' })
}

export async function putNews(
  organizationCode: OrganizationModel['code'],
  newsId: NewsModel['id'],
  body: NewsInput
) {
  return await useAPI<NewsModel>(`organization/${organizationCode}/news/${newsId}/`, {
    body,
    method: 'PUT',
  })
}

export async function patchNews(
  organizationCode: OrganizationModel['code'],
  newsId: NewsModel['id'],
  body: NewsInput
) {
  return await useAPI<NewsModel>(`organization/${organizationCode}/news/${newsId}/`, {
    body,
    method: 'PATCH',
  })
}

export async function deleteNews(
  organizationCode: OrganizationModel['code'],
  newsId: NewsModel['id']
) {
  return await useAPI(`organization/${organizationCode}/news/${newsId}/`, { method: 'DELETE' })
}

export async function postNewsHeader(
  organizationCode: OrganizationModel['code'],
  newsId: NewsModel['id'],
  body
) {
  return await useAPI(`organization/${organizationCode}/news/${newsId}/header/`, {
    body,
    method: 'POST',
  })
}

export async function patchNewsHeader(
  organizationCode: OrganizationModel['code'],
  newsId: NewsModel['id'],
  image_id,
  body
) {
  return await useAPI(`organization/${organizationCode}/news/${newsId}/header/${image_id}/`, {
    body,
    method: 'PATCH',
  })
}
