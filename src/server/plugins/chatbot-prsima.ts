export default defineNitroPlugin((nitroApp) => {
  nitroApp.hooks.hook('close', async () => {
    await chatbotPrisma.$disconnect()
  })
})
