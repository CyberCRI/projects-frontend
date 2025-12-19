import { RefOrRaw } from '@/interfaces/utils'

/**
 * filter only ref/computed vars
 * @function
 * @name onlyRef
 * @kind variable
 * @param {string | globalThis.Ref<any} values_0
 * @param {any} any> | globalThis.ComputedRef<any>
 * @returns {[Ref | ComputedRef]}
 * @exports
 */
export const onlyRefs = (values: (RefOrRaw<string> | RefOrRaw<number>)[]): [Ref | ComputedRef] => {
  return values.filter((v) => isRef(v) || isReactive(v)) as [Ref | ComputedRef]
}
