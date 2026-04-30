// global lpiworker for ts
declare global {
  interface Window {
    lpiSharedWorker?: SharedWorker
    handleChatClick?: (evt: Event) => void
  }
}
