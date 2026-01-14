// global lpiworker for ts
declare global {
  interface Window {
    lpiSharedWorker?: SharedWorker
  }
}
