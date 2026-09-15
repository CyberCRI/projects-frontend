const getTranslatableFields = (entity: object, fields: string[], locale: string) => {
  const res = {}

  for (const field of fields) {
    const _field = unref(field)

    const isNotTranslated = !entity[`${_field}_detected_language`]
    const isDetectectedLanguage = locale == entity[`${_field}_detected_language`]

    //    TODO: temp fix for multilingual edits
    //    display translated text even if we are on original language
    // else if (useOriginalValue(_entity, _field)) res[_field] = _entity[_field] || _defaultValue
    if (isDetectectedLanguage || isNotTranslated) {
      res[_field] = entity[_field] || ''
    } else {
      res[_field] = entity[`${_field}_${locale}`] || entity[_field] || ''
    }
  }

  return res
}

export const translateEntity = <
  DataT extends { $t: Record<string, any> },
  Fields extends (keyof DataT['$t'])[] = (keyof DataT['$t'])[],
>(
  entity,
  fields: Fields,
  locale: string
): DataT => {
  if (!entity) {
    return entity
  }
  return {
    ...entity,
    $t: getTranslatableFields(entity, fields as string[], locale),
  }
}

export const translateMany = <Result, Data>(
  func: (data: Data, locale: string) => Result,
  datas: Data[],
  locale: string
) => {
  return datas.map((data) => func(data, locale))
}
