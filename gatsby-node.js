/**
 * Implement Gatsby's Node APIs in this file.
 *
 * See: https://www.gatsbyjs.org/docs/node-apis/
 */

const path = require(`path`)

const createSermons = async (graphql, createPage, after) => {
    after = after ? after : '';

    const result = await graphql(`
query {
  avorg {
    sermons(language: ENGLISH, first: 50, after: "${after}") {
      nodes {
        title
        id
        presenters {
          name
          photo {
            url(size: 10)
          }
        }
        mediaFiles {
          url
        }
        recordingDate
        description
      }
      pageInfo {
        hasNextPage
        endCursor
      }
    }
  }
}
    `)

    const sermons = result.data.avorg.sermons

    if (sermons.nodes) {
        sermons.nodes.forEach((node) => {
            createPage({
                path: `english/sermons/recordings/${node.id}`,
                component: path.resolve(`./src/templates/sermon.js`),
                context: {
                    node: node
                }
            })
        })
    }

    if (sermons.pageInfo.hasNextPage) {
        await createSermons(graphql, createPage, sermons.pageInfo.endCursor)
    }
}

exports.createPages = async ({graphql, actions}) => {
    const { createPage } = actions

    await createSermons(graphql, createPage)
}