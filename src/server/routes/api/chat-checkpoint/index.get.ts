import checkAdminRights from '@/server/utils/check-admin-rights.js'
import useCheckpointerDb from '@/server/utils/checkpointer-db'
import format from 'pg-format'

export default defineLazyEventHandler(() => {
  return defineEventHandler(async (event) => {
    await checkAdminRights(event)

    // const { appApiOrgCode } = useRuntimeConfig().public
    const { checkpointer } = await useCheckpointerDb()

    const pool = (checkpointer as any).pool

    // return 404 if not configured
    if (!pool) {
      throw createError({
        statusCode: 404,
        message: 'No checkpointer pool',
      })
    }

    // try {
    const sql = format(
      // `
      //   SELECT
      //       thread_id,
      //       metadata,
      //       MIN(checkpoint_id) AS first_checkpoint_id,
      //       COUNT(*)           AS total_checkpoints
      //   FROM
      //       agents_memory.checkpoints
      //   GROUP BY thread_id
      //   ORDER BY first_checkpoint_id DESC
      //   `

      `
        SELECT DISTINCT ON (thread_id)
          thread_id,
          checkpoint_id  AS first_checkpoint_id,
          metadata
        FROM agents_memory.checkpoints
        ORDER BY thread_id, checkpoint_id DESC
        `

      // `
      //     SELECT
      //       c.thread_id,
      //       c.metadata,
      //       c.checkpoint_id AS firt_checkpoint_id,
      //       stats.total_checkpoints
      //     FROM agents_memory.checkpoints c
      //     INNER JOIN (
      //       SELECT
      //         thread_id,
      //         MIN(checkpoint_id) AS firt_checkpoint_id,
      //         COUNT(*)           AS total_checkpoints
      //       FROM agents_memory.checkpoints
      //       GROUP BY thread_id
      //     ) stats
      //       ON c.thread_id = stats.thread_id
      //      AND c.checkpoint_id = stats.firt_checkpoint_id

      //     WHERE c.checkpoint -> 'channel_versions' ->> 'organization_code' = $1
      //     ORDER BY c.checkpoint_id DESC
      //   `
    )
    const result = await pool.query(sql) //, [appApiOrgCode])
    const threads = result.rows
    return threads
    // } finally {
    //   client.release()
    // }
  })
})
