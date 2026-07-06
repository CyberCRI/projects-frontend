/* eslint-disable @typescript-eslint/no-empty-object-type */

import type { IconImageChoice, IconTabImageChoice } from '~/functs/IconImage'

// global lpiworker for ts
declare global {
  interface Window {
    lpiSharedWorker?: SharedWorker
    handleChatClick?: (evt: Event) => void
    grecaptcha: ReCaptchaV2.ReCaptcha
  }
}

type IconRegistery = {
  [K in IconImageChoice]: true
}

type IconTabRegistery = {
  [K in IconTabImageChoice]: true
}

declare module 'shared-projects-frontend' {
  export interface Icon extends IconRegistery {}
  export interface IconTab extends IconTabRegistery {}
}
