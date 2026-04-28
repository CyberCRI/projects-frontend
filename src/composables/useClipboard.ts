import useToasterStore from '~/stores/useToaster'

export const useClipBoard = () => {
  const toaster = useToasterStore()
  const { t } = useNuxtI18n()

  const copy = (text: string) => {
    if (!navigator?.clipboard) {
      return
    }
    navigator?.clipboard
      .writeText(text)
      .then(() => {
        toaster.pushSuccess(t('clipboard.copy'))
      })
      .catch((e) => console.error(`Failed copy to clipboard: ${e}`))
  }

  const read = async () => {
    if (!navigator?.clipboard) {
      return ''
    }
    return await navigator?.clipboard.readText().catch(() => null)
  }
  return { copy, read }
}
