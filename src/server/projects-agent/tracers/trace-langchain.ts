const runtimeConfig = useRuntimeConfig()

const { appLangchainTrace } = runtimeConfig

const traceLangchain = (...args) => {
  if (appLangchainTrace) {
    console.log('[LangChain TRACE]', ...args)
  }
}

export default traceLangchain
