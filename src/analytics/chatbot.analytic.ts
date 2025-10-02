import analytics from '@/analytics'

export default {
  open: () => {
    analytics.track('chatbot_open', {})
  },
  close: () => {
    analytics.track('chatbot_close', {})
  },

  send: (message: string) => {
    analytics.track('chatbot_send_message', { message: message })
  },

  receive: (message: string) => {
    analytics.track('chatbot_get_response', { message: message })
  },

  error: (error: string) => {
    analytics.track('chatbot_error', { error: error })
  },
}
