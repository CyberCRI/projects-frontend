export default async function c(
  model: any,
  options: {
    offset: number
    limit: number
    where?: object // optional filters
    orderBy?: object // optional sorting
    include?: object // optional relations
  }
) {
  const { offset, limit, where = {}, orderBy, include } = options
  // Run count and data queries in parallel
  const [count, data] = await Promise.all([
    model.count({ where }),
    model.findMany({
      where,
      orderBy,
      include,
      skip: offset,
      take: limit,
    }),
  ])

  const total = Math.ceil(count / limit)
  const current = Math.floor(offset / limit) + 1
  return {
    results: data,
    count, // total number of matching records
    total_page: total, // total number of pages
    current_page: current,
    limit,
  }
}
