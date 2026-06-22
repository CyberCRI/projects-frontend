import type { ProjectTab } from '~/models/projects-tabs.model'
import type { IconTabImageChoice } from '~/functs/IconImage'
import { DEFAULT_ICONS_TABS } from '~/functs/constants'
import { ICONS_TABS } from '~/functs/IconImage'

/**
 * safe get icon from tab element (return default tab if not exists)
 *
 * @function
 * @name safeProjectIconTab
 * @kind variable
 * @param {ProjectTab} tab
 * @returns {IconTabImageChoice}
 * @exports
 */
export const safeProjectIconTab = (
  icon: ProjectTab['icon'],
  type: ProjectTab['type']
): IconTabImageChoice => {
  // if icon exists in iCONS_TABS, is ok
  if (ICONS_TABS[icon]) {
    return icon
  }

  // else return default type form tab or 'tab' icon
  return DEFAULT_ICONS_TABS[type] || 'Tab'
}
