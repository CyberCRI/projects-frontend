import {
  getGroup as fetchGetGroup,
  getGroupProject as fetchGetGroupProject,
  getHierarchyGroups as fetchGetHierarchyGroups,
  getGroupMember as fetchGetGroupMember,
  getGroupSimilar as fetchGetGroupSimilar,
  getSubGroup as fetchGetSubGroup,
  getGroupLocation as fetchLocationsGroup,
} from '@/api/groups.service'
import useAsyncAPI from '@/composables/useAsyncAPI'
import useAsyncPaginationAPI from '@/composables/useAsyncPaginationAPI'
import { onlyRefs } from '@/functs/onlyRefs'
import { ImageGallery } from '@/interfaces/gallery'
import { RefOrRaw } from '@/interfaces/utils'
import { GroupModel } from '@/models/group.model'
import { OrganizationModel } from '@/models/organization.model'

const DEFAULT_CONFIG = {}

export const getGroup = (
  organizationCode: RefOrRaw<OrganizationModel['code']>,
  groupId: RefOrRaw<GroupModel['id']>,
  config = {}
) => {
  const { translateGroup } = useAutoTranslate()
  const key = computed(() => `${unref(organizationCode)}::group::${unref(groupId)}`)

  return useAsyncAPI(
    key,
    () => fetchGetGroup(unref(organizationCode), unref(groupId), { ...DEFAULT_CONFIG }),
    {
      translate: translateGroup,
      watch: onlyRefs([organizationCode, groupId]),
      ...config,
    }
  )
}

export const getHierarchyGroups = (
  organizationCode: RefOrRaw<OrganizationModel['code']>,
  config = {}
) => {
  const { translateGroup } = useAutoTranslate()
  const key = computed(() => `${unref(organizationCode)}::hierarchy-groups`)

  return useAsyncAPI(
    key,
    ({ config }) =>
      fetchGetHierarchyGroups(unref(organizationCode), { ...DEFAULT_CONFIG, ...config }),
    {
      translate: translateGroup,
      watch: onlyRefs([organizationCode]),
      ...config,
    }
  )
}

export const getGroupProject = (
  organizationCode: RefOrRaw<OrganizationModel['code']>,
  groupId: RefOrRaw<GroupModel['id']>,
  config = {}
) => {
  const { translateProjects } = useAutoTranslate()
  const key = computed(() => `${unref(organizationCode)}::group::${unref(groupId)}::projects`)

  return useAsyncPaginationAPI(
    key,
    ({ config }) =>
      fetchGetGroupProject(unref(organizationCode), unref(groupId), {
        ...DEFAULT_CONFIG,
        ...config,
      }),
    {
      translate: translateProjects,
      watch: onlyRefs([organizationCode, groupId]),
      ...config,
    }
  )
}

export const getGroupMember = (
  organizationCode: RefOrRaw<OrganizationModel['code']>,
  groupId: RefOrRaw<GroupModel['id']>,
  config = {}
) => {
  const key = computed(() => `${unref(organizationCode)}::group::${unref(groupId)}::members`)

  return useAsyncPaginationAPI(
    key,
    ({ config }) =>
      fetchGetGroupMember(unref(organizationCode), unref(groupId), {
        ...DEFAULT_CONFIG,
        ...config,
      }),
    {
      watch: onlyRefs([organizationCode, groupId]),
      ...config,
    }
  )
}

export const getGroupSimilar = (
  organizationCode: RefOrRaw<OrganizationModel['code']>,
  groupId: RefOrRaw<GroupModel['id']>,
  config = {}
) => {
  const { translateGroups } = useAutoTranslate()
  const key = computed(() => `${unref(organizationCode)}::group::${unref(groupId)}::similars`)

  return useAsyncPaginationAPI(
    key,
    ({ config }) =>
      fetchGetGroupSimilar(unref(organizationCode), unref(groupId), {
        ...DEFAULT_CONFIG,
        ...config,
      }),
    {
      translate: translateGroups,
      watch: onlyRefs([organizationCode, groupId]),
      ...config,
    }
  )
}

export const getSubGroup = (
  organizationCode: RefOrRaw<OrganizationModel['code']>,
  groupId: RefOrRaw<GroupModel['id']>,
  config = {}
) => {
  const { translateGroups } = useAutoTranslate()
  const key = computed(() => `${unref(organizationCode)}::group::${unref(groupId)}::subgroup`)

  return useAsyncPaginationAPI(
    key,
    ({ config }) =>
      fetchGetSubGroup(unref(organizationCode), unref(groupId), {
        ...DEFAULT_CONFIG,
        ...config,
      }),
    {
      translate: translateGroups,
      watch: onlyRefs([organizationCode, groupId]),
      ...config,
    }
  )
}

export const getGroupLocation = (
  organizationCode: RefOrRaw<OrganizationModel['code']>,
  groupId: RefOrRaw<GroupModel['id']>,
  config = {}
) => {
  const { translateProjectLocations } = useAutoTranslate()
  const key = computed(() => `${unref(organizationCode)}::group::${unref(groupId)}::locations`)

  return useAsyncAPI(
    key,
    ({ config }) =>
      fetchLocationsGroup(unref(organizationCode), unref(groupId), {
        ...DEFAULT_CONFIG,
        ...config,
      }),
    {
      translate: translateProjectLocations,
      watch: onlyRefs([organizationCode, groupId]),
      ...config,
    }
  )
}

export const getGroupGallery = (
  organizationCode: RefOrRaw<OrganizationModel['code']>,
  groupId: RefOrRaw<GroupModel['id']>,
  config = {}
) => {
  const images = [
    {
      id: 0,
      src: 'https://www.airproducts.fr/-/media/images/1440x810/masthead/949946968-laboratory-16x9.jpg?as=0&w=1439&hash=BECD74768EC803085E4B64DA85E5BA12',
      atl: '',
    },
    {
      id: 1,
      src: 'https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Ftse1.mm.bing.net%2Fth%2Fid%2FOIP.nEWcNXhCrSEcaIXEKip62gHaEK%3Fpid%3DApi&f=1&ipt=8084e86786f11b031a3a608565f9425624b7b1ef0d5f1abcac97b77560d6e453&ipo=images',
      atl: '',
    },
    {
      id: 2,
      src: 'https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Ftse2.mm.bing.net%2Fth%2Fid%2FOIP.2lD9cc1yCOVFym44L1nTFAHaE8%3Fpid%3DApi&f=1&ipt=f233640406d6527de000e3b73126bd3dc47cb4cd4c31520bd27a7d98cee2cc0d&ipo=images',
      atl: '',
    },
    {
      id: 3,
      src: 'https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Ftse1.mm.bing.net%2Fth%2Fid%2FOIP.oW7kAKM2oTM9HDuOY6qUzQHaE8%3Fpid%3DApi&f=1&ipt=7521a75ec0ecc5734fba1134a18978b46fb024e3dc3f83091dfbe130ca9b4dad&ipo=images',
      atl: '',
    },
    {
      id: 4,
      src: 'https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Ftse1.mm.bing.net%2Fth%2Fid%2FOIP.MrVWn5QA01Tr7GA2cnPmaQHaE7%3Fpid%3DApi&f=1&ipt=72e49dc4e1f74878312dfdd35008c670404dfdbed41806e29fd93d04b1797607&ipo=images',
      atl: '',
    },
    {
      id: 5,
      src: 'https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Ftse1.mm.bing.net%2Fth%2Fid%2FOIP.YDS_eRPyT1ndTiY46PWfywHaEK%3Fpid%3DApi&f=1&ipt=d16d4bb2f5c24df235de5edc093f8346665feccd0c5036e861d882243cfabb29&ipo=images',
      atl: '',
    },
  ]
  const key = computed(() => `${unref(organizationCode)}::group::${unref(groupId)}::gallery`)

  return useAsyncPaginationAPI(
    key,
    async () => {
      return {
        current_page: 0,
        total_page: 50,
        count: 666,
        results: images,
      } as PaginationResult<ImageGallery>
    },
    {
      watch: onlyRefs([organizationCode, groupId]),
      paginationConfig: {
        limit: images.length,
      },
      ...config,
    }
  )
}
