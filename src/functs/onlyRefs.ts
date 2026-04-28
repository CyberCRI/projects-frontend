import { RefOrRaw } from '~/interfaces/utils'

/**
 * filter only ref/computed vars
 *
 * @constant
 * @name onlyRefs
 * @kind variable
 * @type {<T extends string | number>(values: RefOrRaw<T>[]) => [Ref | ComputedRef]}
 * @exports
 */
export const onlyRefs = <T extends string | number>(values: RefOrRaw<T>[]): [Ref | ComputedRef] => {
  return values.filter((v) => isRef(v) || isReactive(v)) as [Ref | ComputedRef]
}
