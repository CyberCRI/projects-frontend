import { defineStore } from 'pinia'
import type { LanguageType } from '@/models/types'
import { useRuntimeConfig } from '#imports'

export interface LanguageState {
  all: LanguageType[]
  allAvailable: LanguageType[]
  current: LanguageType
}

const useLanguagesStore = defineStore('languages', () => {
  const { locale } = useI18n()
  const organizationStore = useOrganizations()
  const runtimeConfig = useRuntimeConfig()
  const allLocales: LanguageType[] = runtimeConfig.public.allLocales
  const all = useState(() => organizationStore.current?.languages || [])
  const current = useState(() => locale.value)
  return { allLocales, all, current }
})

export default useLanguagesStore
