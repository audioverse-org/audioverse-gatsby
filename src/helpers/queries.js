const _ = require(`lodash`)

// Must include pageInfo.hasNextPage and pageInfo.endCursor in generated queries
exports.getPages = async (graphql, queryBuilder, queryArgs, pageSelector, cursor = null, pages = []) => {
    queryArgs.cursor = cursor

    const query = queryBuilder(queryArgs),
        result = await graphql(query),
        page = _.get(result, pageSelector),
        hasNextPage = _.get(page, 'pageInfo.hasNextPage')

    pages.push(page)

    if (hasNextPage) {
        const nextCursor = _.get(page, 'pageInfo.endCursor')

        return exports.getPages(graphql, queryBuilder, queryArgs, pageSelector, nextCursor, pages)
    }

    return pages
}