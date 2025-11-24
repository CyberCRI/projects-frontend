/**
 * Type to modify interface with auto translate fields
 * use like Translated<BlogEntries, 'title' | 'content'>
 *
 * @typedef
 * @name Translated
 * @kind variable
 * @param {unknown} Model
 * @param {unknown} Fields
 * @exports
 */
export type Translated<Model, Fields extends keyof Model> = Model & {
  $t: Pick<Model, Fields>
}
