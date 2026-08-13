import { required, minLength } from '@vuelidate/validators'
import { describe, it, expect } from 'vitest'
import useForm from '~/composables/useForm'
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
      name: 'remi',
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
      name: 'remi',
      familly: 'beauregard',
      childrends: ['me', 'then', 'everybody'],
    }
    const { form } = useForm({ default: def, validateTimeout: 0 })

    expect(form.value.name).toEqual(def.name)
    form.value.name = 'luke'
    expect(form.value.name).toEqual('luke')
  })

  it('CleanedData', async () => {
    const def = {
      name: 'remi',
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
    expect(form.value.name).toEqual('remi')
    await delay(10)
    expect(cleanedData.value.name).toEqual('newName')
    expect(cleanedData.value.parents).toBeTruthy()
  })

  it('ValidateRules', async () => {
    const def = {
      name: 'remi',
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

    form.value.name = 'luke'
    form.value.childrens = ['me']
    await delay(10)

    expect(isValid.value).toBeFalsy()
    expect(errors.value.name).toEqual([])
    expect(errors.value.childrens).toBeTruthy()
    expect(cleanedData.value).toBeNull()
  })

  it('with v-model', async () => {
    const model = ref({
      name: 'remi',
    })

    const onClean = () => {
      return {
        name: 'newName',
      }
    }

    const rules = {
      name: { required, minLengthValue: minLength(4) },
    }
    const { form, cleanedData } = useForm({ rules, model, onClean })

    expect(form.value.name).toEqual('remi')
    await delay(10)
    expect(cleanedData.value.name).toEqual('newName')
    form.value.name = 'li'
    await delay(10)
    expect(cleanedData.value).toBe(null)
  })

  // synchro form <--> model

  it('should initialize form from model', () => {
    const model = ref({
      name: 'remi',
      age: 42,
    })

    const { form } = useForm({
      model,
    })

    expect(form.value).toEqual({
      name: 'remi',
      age: 42,
    })
  })

  it('should initialize form with default and override with model', () => {
    const model = ref({
      name: 'remi',
    })

    const { form } = useForm({
      default: {
        name: 'default',
        age: 42,
      },
      model,
    })

    expect(form.value).toEqual({
      name: 'remi',
      age: 42,
    })
  })

  it('should update model when form changes', async () => {
    const model = ref({
      name: 'remi',
    })

    const { form } = useForm({
      model,
    })

    form.value.name = 'luke'

    await nextTick()

    expect(form.value.name).toBe('luke')
    expect(model.value.name).toBe('luke')
  })

  it('should update model when form changes deeply', async () => {
    const model = ref({
      user: {
        name: 'remi',
        address: {
          city: 'Albuquerque',
        },
      },
    })

    const { form } = useForm({
      model,
    })

    form.value.user.name = 'luke'
    form.value.user.address.city = 'Trois'

    await nextTick()

    expect(model.value).toEqual({
      user: {
        name: 'luke',
        address: {
          city: 'Trois',
        },
      },
    })
  })

  it('should update form when model changes', async () => {
    const model = ref({
      name: 'remi',
    })

    const { form } = useForm({
      model,
    })

    model.value = {
      name: 'luke',
    }

    await nextTick()

    expect(form.value).toEqual({
      name: 'luke',
    })
  })

  it('should update form when model changes deeply', async () => {
    const model = ref({
      user: {
        name: 'remi',
      },
    })

    const { form } = useForm({
      model,
    })

    model.value.user.name = 'luke'

    await nextTick()

    expect(form.value).toEqual({
      user: {
        name: 'luke',
      },
    })
  })

  it('should keep form and model synchronized after multiple changes', async () => {
    const model = ref({
      name: 'remi',
      age: 20,
    })

    const { form } = useForm({
      model,
    })

    form.value.name = 'luke'

    await nextTick()

    expect(model.value).toEqual({
      name: 'luke',
      age: 20,
    })

    model.value.age = 30

    await nextTick()

    expect(form.value).toEqual({
      name: 'luke',
      age: 30,
    })

    form.value.name = 'jackSparrow'

    await nextTick()

    expect(form.value).toEqual({
      name: 'jackSparrow',
      age: 30,
    })

    expect(model.value).toEqual({
      name: 'jackSparrow',
      age: 30,
    })
  })

  it('should not create an infinite synchronization loop', async () => {
    const model = ref({
      name: 'remi',
    })

    const { form } = useForm({
      model,
    })

    form.value.name = 'luke'

    await nextTick()
    await nextTick()

    expect(form.value).toEqual({
      name: 'luke',
    })

    expect(model.value).toEqual({
      name: 'luke',
    })
  })

  it('should synchronize arrays', async () => {
    const model = ref({
      children: ['child1', 'child2'],
    })

    const { form } = useForm({
      model,
    })

    form.value.children.push('child3')

    await nextTick()

    expect(model.value.children).toEqual(['child1', 'child2', 'child3'])
  })

  it('should synchronize replacing arrays', async () => {
    const model = ref({
      children: ['child1', 'child2'],
    })

    const { form } = useForm({
      model,
    })

    form.value.children = ['newchild1', 'newchild2', 'newchild3']

    await nextTick()

    expect(model.value.children).toEqual(['newchild1', 'newchild2', 'newchild3'])
  })
})
