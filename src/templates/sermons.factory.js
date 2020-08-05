const path = require(`path`),
    constants = require(`../constants.js`)

exports.createPages = (graphql, createPage) => {
    graphql(`{
  sermons(language:ENGLISH) {
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
}`)

    Object.keys(constants.languages).map((key) => {
        const lang = constants.languages[key]

        createPage({
            path: `${lang.base_url}/sermons`
        })
    })
}