/**
 * Implement Gatsby's Node APIs in this file.
 *
 * See: https://www.gatsbyjs.org/docs/node-apis/
 */

const path = require(`path`)

const getSermons = async (graphql, language = "ENGLISH") => {
    const run = async (after = '', nodes = []) => {

        const result = await graphql(`
query {
  avorg {
    sermons(language: ${language}, first: 50, after: "${after}") {
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

        nodes = nodes.concat(sermons.nodes)

        if (sermons.pageInfo.hasNextPage) {
            return await run(sermons.pageInfo.endCursor, nodes)
        } else {
            return nodes
        }
    }

    return await run()
}

const createSermons = async (graphql, createPage) => {
    const englishSermons = await getSermons(graphql)

    if (englishSermons) {
        englishSermons.forEach((node) => {
            createPage({
                path: `english/sermons/recordings/${node.id}`,
                component: path.resolve(`./src/templates/sermon.js`),
                context: {node}
            })
        })
    }

    const spanishSermons = await getSermons(graphql, "SPANISH")

    if (spanishSermons) {
        spanishSermons.forEach((node) => {
            createPage({
                path: `espanol/sermones/grabaciones/${node.id}`,
                component: path.resolve(`./src/templates/sermon.js`),
                context: {node}
            })
        })
    }
}

exports.createPages = async ({graphql, actions}) => {
    const {createPage} = actions

    await createSermons(graphql, createPage)
}