const _ = require(`lodash`),
    constants = require(`../constants`)

const NUM_PER_PAGE = 250;

exports.NUM_PER_PAGE = NUM_PER_PAGE;

// Required in query:
//   pageInfo.hasNextPage
//   pageInfo.endCursor
//   aggregate.count
exports.getPages = async (graphql, query, queryArgs, pageSelector) => {
    const result = await graphql(query, queryArgs),
        page = _.get(result, pageSelector),
        pages = [page],
        pageCount = Math.ceil(_.get(page, 'aggregate.count') / NUM_PER_PAGE),
        maxPage = Math.min(pageCount, constants.query_page_limit)

    if (!page) return [];
    if (!maxPage || maxPage < 1) return pages;

    pages.push(...await Promise.all(_.range(1, maxPage).map(i => graphql(query, {
        ...queryArgs,
        cursor: Buffer.from(i * NUM_PER_PAGE + 1 + '').toString('base64')
    }).then(result => _.get(result, pageSelector)))));

    return pages
}
