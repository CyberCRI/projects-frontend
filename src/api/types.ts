export interface APIParams {
    limit?: Number // Number of results to return per page.
    offset?: Number // The initial index from which to return the results.
    organizations?: number[]
}

export interface APIResponseList<T> {
    count: Number // Total items
    next: String // Url to get next result
    previous: String // Url to get previous result
    results: T[] // Items
}
