exports.createPages = (graphql) => graphql(`{
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