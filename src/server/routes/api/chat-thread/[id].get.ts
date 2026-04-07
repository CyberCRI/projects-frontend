import checkAdminRights from '@/server/utils/check-admin-rights.js'
import useCheckpointerDb from '@/server/utils/checkpointer-db'
import format from 'pg-format'

export default defineLazyEventHandler(() => {
  return defineEventHandler(async (event) => {
    await checkAdminRights(event)

    const id = getRouterParam(event, 'id')
    if (!id) {
      setResponseStatus(event, 400)
      return {
        error: 'Missing required "id" query parameter',
      }
    }

    const { appApiOrgCode } = useRuntimeConfig().public
    const { checkpointer } = await useCheckpointerDb()

    const pool = checkpointer.pool

    // return 404 if not configured
    if (!pool) {
      throw createError({
        statusCode: 404,
        message: 'No checkpointer pool',
      })
    }

    // try {
    // const sql = format(
    //   `
    //     SELECT
    //         *
    //     FROM
    //         agents_memory.checkpoints
    //     WHERE
    //         thread_id = $1
    //     ORDER BY checkpoint_id ASC
    //     `
    // )
    // const result = await pool.query(sql, [id])
    // const checkpoints = result.rows

    const config = { configurable: { thread_id: id, organization_code: appApiOrgCode } }
    const checkpoints = []

    for await (const tuple of checkpointer.list(config, { limit: 1 })) {
      checkpoints.push({
        checkpoint_id: tuple.config.configurable.checkpoint_id,
        messages: tuple.checkpoint.channel_values.messages,
        metadata: tuple.metadata,
        agent_id: tuple.checkpoint.channel_values.agent_id,
        people_id: tuple.checkpoint.channel_values.people_id,
        keycloak_id: tuple.checkpoint.channel_values.keycloak_id,
        organization_code: tuple.checkpoint.channel_values.organization_code,

        tupe: tuple,
      })
    }

    return checkpoints
    // } finally {
    //   client.release()
    // }
  })
})
