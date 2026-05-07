import type { ValidationRuleWithoutParams, ValidationRuleWithParams } from '@vuelidate/core'
import { required } from '@vuelidate/validators'
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
