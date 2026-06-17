import type { TagModel } from '~/models/tag.model'
import { pick } from 'es-toolkit'

export const addIfExists = <T, Res>(key: string, obj: any, func: (data: T) => Res) => {
  if (obj[key]) {
    return {
      [key]: func(obj[key]),
    }
  }
  return {}
}

export const tagMapPreview = (tag: TagModel) => ({
  item_type: 'tag',
  ...pick(tag, ['id', 'title', 'description']),
})
