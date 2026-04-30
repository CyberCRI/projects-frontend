import type { TagModel } from '~/models/tag.model'

export function isClassificationOfType(classification: TagModel, type: TagModel['type']) {
  return classification.type === type
}

export function isCustomClassification(classification: TagModel) {
  return isClassificationOfType(classification, 'Custom')
}

export function isEscoClassification(classification: TagModel) {
  return isClassificationOfType(classification, 'ESCO')
}

export function isWikipediaClassification(classification: TagModel) {
  return isClassificationOfType(classification, 'Wikipedia')
}

export default {
  isClassificationOfType,
  isCustomClassification,
  isEscoClassification,
  isWikipediaClassification,
}
