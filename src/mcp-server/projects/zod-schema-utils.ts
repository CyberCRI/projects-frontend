import { z } from 'zod'

export default {
  string: (...args) =>
    z
      .string(...args)
      .optional()
      .nullable(),
  number: (...args) =>
    z
      .number(...args)
      .optional()
      .nullable(),
  boolean: (...args) =>
    z
      .boolean(...args)
      .optional()
      .nullable(),
  array: (schema, ...args) =>
    z
      .array(schema, ...args)
      .optional()
      .nullable(),
  object: (schema) => z.object(schema),
  literal: (value) => z.literal(value),
}
