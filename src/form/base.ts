import type { ValidationRuleWithoutParams, ValidationRuleWithParams } from '@vuelidate/core'
import { isEqual, mapValues, omit, pick } from 'es-toolkit'
import { html2html, textIsEmpty } from '~/functs/tiptap'
import { required, url } from '@vuelidate/validators'
import { MIMETYPES_IMAGES } from '~/functs/constants'

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

    return t('resource.file.form.too-big', { maxSize: maxSizeMo })
  },
  $params: {
    maxSize,
  },
})

/**
 * check if file is a valid image (from mimetype)
 *
 * @constant
 * @name isImageFile
 * @kind variable
 * @type {ValidationRuleWithoutParams<any>}
 * @exports
 */
export const isImageFile: ValidationRuleWithoutParams = {
  $validator: (value?: File) => {
    if (!value) {
      return true
    }
    return MIMETYPES_IMAGES.includes(value.type)
  },
  $message: () => {
    const { t } = useNuxtI18n()

    return t('resource.form.file.invalid-image')
  },
}

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

// options to formEqual
type Options<A, B, Keys extends keyof (A & B)> = {
  html?: readonly Keys[]
  exclude?: readonly Keys[]
}
/**
 * compare 2 form if equal, you can add exlucude to exlucde keys, and html to compare real html value
 *
 * @constant
 * @name formEqual
 * @kind variable
 * @type {<A, B, Keys extends keyof A | keyof B>(a: A, b: B, options?: Options<A, B, Keys>) => boolean}
 * @exports
 */
export const formEqual = <A, B, Keys extends keyof (A & B)>(
  a: A,
  b: B,
  options: Options<A, B, Keys> = {}
): boolean => {
  // remove html/xclude keys
  const keysToExclude = [...(options.exclude || []), ...(options.html || [])]
  const aOmited = omit(a, keysToExclude as (keyof A)[])
  const bOmited = omit(b, keysToExclude as (keyof B)[])

  if (!isEqual(aOmited, bOmited)) {
    return false
  }

  if (options.html) {
    const keysHtml = [...options.html]
    // pick only html keys, and convert it to htmlvalue ( to check diff)
    const aHtml = mapValues(pick(a, keysHtml as (keyof A)[]), (val) => html2html(val as string))
    const bHtml = mapValues(pick(b, keysHtml as (keyof B)[]), (val) => html2html(val as string))

    if (!isEqual(aHtml, bHtml)) {
      return false
    }
  }

  return true
}
