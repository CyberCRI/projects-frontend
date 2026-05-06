import type { ValidationRuleWithoutParams } from '@vuelidate/core'
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
