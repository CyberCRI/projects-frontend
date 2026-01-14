export const RESOURCE_PROJECT_CATEGORY = [
  'inspired-by',
  'element-of',
  'similar-to',
  'next-project',
  'previous-project',
  'translation-of',
  'other',
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
