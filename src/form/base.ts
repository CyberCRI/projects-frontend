import type { ValidationRuleWithoutParams, ValidationRuleWithParams } from '@vuelidate/core'
import { required, url } from '@vuelidate/validators'
import { textIsEmpty } from '~/functs/string'

/**
 * required rules for vuelidate to valie html is not empty (empty <p></p> , only space ...ect)
 *
 * @constant
 * @name requiredContent
 * @kind variable
 * @type {ValidationRuleWithoutParams<any>}
 * @exports
 */
export const requiredContent: ValidationRuleWithoutParams = {
  $validator: (value) => !textIsEmpty(value),
  $message: required.$message,
}

/**
 * check max fileSize input
 *
 * @function
 * @name maxFileSize
 * @kind variable
 * @param {number} maxSize
 * @returns {ValidationRuleWithParams<object, any>}
 * @exports
 */
export const maxFileSize = (maxSize: number): ValidationRuleWithParams => ({
  $validator: (value?: File) => {
    if (!value) {
      return true
    }
    return maxSize > value.size
  },
  $message: ({ $params }) => {
    const { t } = useNuxtI18n()

    // cast params
    const maxSize = ($params as any).maxSize as number

    // convert maxsize to Mo
    const maxSizeMo = Math.round(maxSize / 1024 / 1024)

    return t('resource.file-too-big', { maxSize: maxSizeMo })
  },
  $params: {
    maxSize,
  },
})

/**
 * ignore url without http/https
 *
 * @constant
 * @name urlCheck
 * @kind variable
 * @type {ValidationRuleWithoutParams<any>}
 * @exports
 */
export const urlCheck: ValidationRuleWithoutParams = {
  $validator: (value: string | null, siblingState, vm) => {
    if (!value) {
      return false
    }
    // if not starts without http, add it to validate with validator
    if (!/^https?:\/\//i.test(value)) {
      value = `http://${value}`
    }
    return url.$validator(value, siblingState, vm)
  },
  $message: url.$message,
}
