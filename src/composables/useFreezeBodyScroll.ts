export default function useFreezeBodyScroll(uniqueId) {
  const freezeBodyScroll = () =>
    document.querySelector('body').classList.add(`has-open-drawer-${uniqueId}`)
  const unfreezeBodyScroll = () =>
    document.querySelector('body').classList.remove(`has-open-drawer-${uniqueId}`)

  return {
    freezeBodyScroll,
    unfreezeBodyScroll,
  }
}
