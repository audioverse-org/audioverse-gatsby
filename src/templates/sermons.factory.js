const path = require(`path`),
    constants = require(`../constants.js`)

exports.createPages = (graphql, createPage) => {
    Object.keys(constants.languages).map((key) => {
        const lang = constants.languages[key]

        graphql(`
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

        createPage({
            path: `${lang.base_url}/sermons`
        })
    })
}