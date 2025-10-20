import { describe, it, expect } from 'vitest'
import useForm from '@/composables/useForm'
import { required, minLength } from '@vuelidate/validators'
import { delay } from 'es-toolkit'

describe('useForm', () => {
  it('EmptyData', async () => {
    const { form, isValid, cleanedData, errors } = useForm({ validateTimeout: 0 })

    await delay(10)
    expect(form.value).toMatchObject({})
    expect(cleanedData.value).toMatchObject({})
    expect(isValid.value).toBeTruthy()
    expect(errors.value).toMatchObject({})
  })

  it('DefaultData', async () => {
    const def = {
      name: 'jaques',
      familly: 'beauregard',
      childrends: ['me', 'then', 'everybody'],
    }
    const { form, isValid, cleanedData, errors } = useForm({ default: def, validateTimeout: 0 })

    await delay(10)
    expect(form.value).toMatchObject(def)
    expect(cleanedData.value).toMatchObject(def)
    expect(isValid.value).toBeTruthy()
    expect(errors.value).toMatchObject({})
  })

  it('ChangeData', async () => {
    const def = {
      name: 'jaques',
      familly: 'beauregard',
      childrends: ['me', 'then', 'everybody'],
    }
    const { form } = useForm({ default: def, validateTimeout: 0 })

    expect(form.value.name).toEqual(def.name)
    form.value.name = 'jean'
    expect(form.value.name).toEqual('jean')
  })

  it('CleanedData', async () => {
    const def = {
      name: 'jaques',
      familly: 'beauregard',
      childrends: ['me', 'then', 'everybody'],
    }
    const onClean = (data) => {
      expect(data).toEqual(def)

      return {
        parents: true,
        name: 'newName',
      }
    }
    const { form, cleanedData } = useForm({ default: def, validateTimeout: 0, onClean })

    expect(form.value.parents).toBeUndefined()
    expect(form.value.name).toEqual('jaques')
    await delay(10)
    expect(cleanedData.value.name).toEqual('newName')
    expect(cleanedData.value.parents).toBeTruthy()
  })

  it('ValidateRules', async () => {
    const def = {
      name: 'jaques',
      childrens: ['me', 'then', 'everybody'],
    }
    const rules = {
      name: {
        required,
      },
      childrens: {
        minLengthValue: minLength(2),
      },
    }
    const { form, isValid, cleanedData, errors } = useForm({
      default: def,
      validateTimeout: 0,
      rules,
    })

    await delay(10)
    expect(isValid).toBeTruthy()

    form.value.name = ''
    await delay(10)

    expect(isValid.value).toBeFalsy()
    expect(errors.value.name).toBeTruthy()
    expect(cleanedData.value).toBeNull()

    form.value.name = 'jean'
    form.value.childrens = ['me']
    await delay(10)

    expect(isValid.value).toBeFalsy()
    expect(errors.value.name).toEqual([])
    expect(errors.value.childrens).toBeTruthy()
    expect(cleanedData.value).toBeNull()
  })
})
