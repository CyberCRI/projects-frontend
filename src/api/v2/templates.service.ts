import {
  getTemplate as fetchTemplate,
  getTemplates as fetchTemplates,
} from '~/api/templates.service'
import type { UseAsyncApiConfig, UseAsyncPaginationApiConfig } from '@/api/v2/base.service'
import type { OrganizationModel } from '@/models/organization.model'
import type { TemplateId } from '~/models/template.model'
import type { RefOrRaw } from '@/interfaces/utils'
import { onlyRefs } from '@/functs/onlyRefs'

const DEFAULT_CONFIG = {}

export const getTemplates = (
  organization: RefOrRaw<OrganizationModel['code']>,
  config: UseAsyncPaginationApiConfig = {}
) => {
  const key = computed(() => `${unref(organization)}::templates::all`)

  const { translateTemplates } = useAutoTranslate()

  return useAsyncPaginationAPI(
    key,
    ({ config }) =>
      fetchTemplates(unref(organization), {
        ...DEFAULT_CONFIG,
        ...config,
      }),
    {
      translate: translateTemplates,
      watch: onlyRefs([organization]),
      ...config,
    }
  )
}

export const getTemplate = (
  organization: RefOrRaw<OrganizationModel['code']>,
  templateId: RefOrRaw<TemplateId>,
  config: UseAsyncApiConfig = {}
) => {
  const key = computed(() => `${unref(organization)}::templates::${unref(templateId)}`)

  const { translateTemplate } = useAutoTranslate()

  return useAsyncAPI(
    key,
    ({ config }) =>
      fetchTemplate(unref(organization), unref(templateId), {
        ...DEFAULT_CONFIG,
        ...config,
      }),
    {
      translate: (data) => translateTemplate(data),
      watch: onlyRefs([organization, templateId]),
      ...config,
    }
  )
}
