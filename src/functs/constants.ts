import type {
  GroupMemberRoleType,
  LocationType,
  ProjectGroupRoleType,
  ProjectMemberRoleType,
  ProjectTabType,
} from '~/models/types'
import type { IconTabImageChoice } from '~/functs/IconImage'

export const RESOURCE_PROJECT_CATEGORY = [
  'inspired-by',
  'element-of',
  'similar-to',
  'next-project',
  'previous-project',
  'translation-of',
  'other',
]

export const SDGS = [
  {
    id: 1,
    title: 'No poverty',
    description: 'End poverty in all its forms everywhere.',
    background_color: '#e5243b',
  },
  {
    id: 2,
    title: 'Zero hunger',
    description:
      'End hunger, achieve food security and improved nutrition and promote sustainable agriculture.',
    background_color: '#dda63a',
  },
  {
    id: 3,
    title: 'Good health and well-being',
    description: 'Ensure healthy lives and promote well-being for all at all ages.',
    background_color: '#4c9f38',
  },
  {
    id: 4,
    title: 'Quality education',
    description:
      'Ensure inclusive and equitable quality education and promote lifelong learning opportunities for all.',
    background_color: '#c5192d',
  },
  {
    id: 5,
    title: 'Gender equality',
    description: 'Achieve gender equality and empower all women and girls.',
    background_color: '#ff3a21',
  },
  {
    id: 6,
    title: 'Clean water and sanitation',
    description: 'Ensure availability and sustainable management of water and sanitation for all.',
    background_color: '#26bde2',
  },
  {
    id: 7,
    title: 'Affordable and clean energy',
    description: 'Ensure access to affordable, reliable, sustainable and modern energy for all.',
    background_color: '#fcc30b',
  },
  {
    id: 8,
    title: 'Decent work and economic growth',
    description:
      'Promote sustained, inclusive and sustainable economic growth, full and productive employment and decent work for all.',
    background_color: '#a21942',
  },
  {
    id: 9,
    title: 'Industry, innovation and infrastructure',
    description:
      'Build resilient infrastructure, promote inclusive and sustainable industrialization and foster innovation.',
    background_color: '#fd6925',
  },
  {
    id: 10,
    title: 'Reduced inequalities',
    description: 'Reduce inequality within and among countries.',
    background_color: '#dd1367',
  },
  {
    id: 11,
    title: 'Sustainable cities and communities',
    description: 'Make cities and human settlements inclusive, safe, resilient and sustainable.',
    background_color: '#fd9d24',
  },
  {
    id: 12,
    title: 'Responsible consumption and production',
    description: 'Ensure sustainable consumption and production patterns.',
    background_color: '#bf8b2e',
  },
  {
    id: 13,
    title: 'Climate action',
    description: 'Take urgent action to combat climate change and its impacts.',
    background_color: '#3f7e44',
  },
  {
    id: 14,
    title: 'Life below water',
    description:
      'Conserve and sustainably use the oceans, seas and marine resources for sustainable development.',
    background_color: '#0a97d9',
  },
  {
    id: 15,
    title: 'Life on land',
    description:
      'Protect, restore and promote sustainable use of terrestrial ecosystems, sustainably manage forests, combat desertification, and halt and reverse land degradation and halt biodiversity loss.',
    background_color: '#56c02b',
  },
  {
    id: 16,
    title: 'Peace, justice and strong institutions',
    description:
      'Promote peaceful and inclusive societies for sustainable development, provide access to justice for all and build effective, accountable and inclusive institutions at all levels.',
    background_color: '#00689d',
  },
  {
    id: 17,
    title: 'Partnerships for the goals',
    description:
      'Strengthen the means of implementation and revitalize the Global Partnership for Sustainable Development.',
    background_color: '#19486a',
  },
]

export const CHART_COLORS = [
  '#00B288',
  '#00DBA7',
  '#C2FFF0',
  '#FFCC00',
  '#FFE375',
  '#FF3C00',
  '#FF9473',
  '#FFC5B3',
  '#00B7FF',
  '#6CD5FF',
  '#D6F3FF',
  '#8F00FF',
  '#AE47FF',
  '#D6A2FF',
]
// all unicode letters, marks (for diacriticals), numbers, spaces, and the following characters: - _ . '
export const VALID_NAME_REGEX = /^[\p{Letter}\p{Mark}\p{Number} \-_.']+$/giu

// default organization code
export const DEFAULT_ORGANIZATION_CODE = 'DEFAULT'

// default content value (html)
export const NULL_CONTENT = '<p></p>'

// --- roles ---
//  order is important for choices
export const PROJECTS_GROUP_ROLES: ProjectGroupRoleType[] = [
  'owner_groups',
  'member_groups',
  'reviewer_groups',
]

//  order is important for choices
export const PROJECTS_MEMBERS_ROLES: ProjectMemberRoleType[] = ['owners', 'members', 'reviewers']

export const GROUP_MEMBERS_ROLES: GroupMemberRoleType[] = ['leaders', 'managers', 'members']

export const PROJECT_LOCATIONS_TYPES: LocationType[] = ['address', 'impact', 'team']

// max size file
export const MAX_FILE_SIZE = Math.round(10 * 1024 * 1024)

// valid image mimetype for upload
export const MIMETYPES_IMAGES = [
  'image/jpeg',
  'image/png',
  'image/gif',
  'image/webp',
  'image/svg+xml',
  'image/x-icon',
  'image/bmp',
  'image/avif',
  'image/apng',
]

export const DEFAULT_COLOR_TIPTAP = [
  { color: '#00BDA7', label: 'multieditor.color.colors.carribeanGreen' },
  { color: '#1D727C', label: 'multieditor.color.colors.ming' },
  { color: '#99FFE7', label: 'multieditor.color.colors.aquamarine' },
  { color: '#F0FFFB', label: 'multieditor.color.colors.mintCream' },
  { color: '#FF9473', label: 'multieditor.color.colors.lightSalmon' },
  { color: '#FFCC00', label: 'multieditor.color.colors.sunGlow' },
  { color: '#D6A2FF', label: 'multieditor.color.colors.mauve' },
  { color: '#6CD5FF', label: 'multieditor.color.colors.babyBlue' },
  { color: '#FF3C00', label: 'multieditor.color.colors.coquelicot' },
]

// tabs

export const DEFAULT_ICONS_TABS: { [key in ProjectTabType]: IconTabImageChoice } = {
  blog: 'NewsLine',
  text: 'Briefcase',
}
