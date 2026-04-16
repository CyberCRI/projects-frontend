import routerOptions from '@/app/router.options'
import { RouteRecordRaw } from 'vue-router'
import MockComponent from './MockComponent.vue'

const ReplaceComponents = (element: RouteRecordRaw): RouteRecordRaw => {
  const cloned = { ...element }
  if (cloned.component) {
    cloned.component = MockComponent
  }
  if (cloned.children) {
    cloned.children = cloned.children.map((el) => ReplaceComponents(el))
  }
  return cloned
}

/**
 * mock all path/route defined in projects with emptyComponents
 *
 * @function
 * @name MockRouter
 * @kind variable
 * @returns {RouteRecordRaw[]}
 * @exports
 */
export const MockRouter = () => {
  return routerOptions.routes().map((el) => ReplaceComponents(el))
}
