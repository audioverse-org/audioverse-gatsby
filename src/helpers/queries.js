const _ = require(`lodash`),
    constants = require(`../constants`)

const NUM_PER_PAGE = 250;

exports.NUM_PER_PAGE = NUM_PER_PAGE;

// Must include pageInfo.hasNextPage and pageInfo.endCursor in generated queries
exports.getPages = async (graphql, query, queryArgs, pageSelector, cursor = null, pages = []) => {
    queryArgs.cursor = cursor

    const result = await graphql(query, queryArgs),
        page = _.get(result, pageSelector)

    pages.push(page)

    const maxPage = Math.min(Math.ceil(_.get(page, 'aggregate.count') / NUM_PER_PAGE), constants.query_page_limit)

    pages.push(...await Promise.all(_.range(1, maxPage).map(i => graphql(query, {
        ...queryArgs,
        cursor: Buffer.from(i * NUM_PER_PAGE + 1 + '').toString('base64')
    }).then(result => _.get(result, pageSelector)))));

    return pages
}
