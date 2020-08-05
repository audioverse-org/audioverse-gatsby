const path = require(`path`),
    constants = require(`../constants.js`)

exports.createPages = async (graphql, createPage) => {
    await Promise.all(Object.keys(constants.languages).map(async (key) => {
        const lang = constants.languages[key]

        const result = await graphql(`
{
  sermons(language:${key}) {
    nodes {
      title
    }
    pageInfo {
      hasNextPage
      hasPreviousPage
      startCursor
      endCursor
    }
    aggregate {
      count
    }
  }
}
`)
        const nodes = result &&
            result.data &&
            result.data.sermons &&
            result.data.sermons.nodes

        createPage({
            path: `${lang.base_url}/sermons`,
            context: {nodes}
        })
    }))
}