const _ = require(`lodash`),
    path = require(`path`),
    constants = require(`../constants.js`)

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
          photoWithFallback {
            url(size: 50)
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

        const sermons = _.get(result, 'data.avorg.sermons'),
            hasNextPage = _.get(sermons, 'pageInfo.hasNextPage')

        nodes = nodes.concat(_.get(sermons, 'nodes'))

        if (hasNextPage) {
            const endCursor = _.get(sermons, 'pageInfo.endCursor')

            return await run(endCursor, nodes)
        } else {
            return nodes
        }
    }

    return await run()
}

const createSermon = async (createPage, node, pathPrefix) => {
    const nodeId = _.get(node, 'node.id')

    await createPage({
        path: `${pathPrefix}/sermons/${nodeId}`,
        component: path.resolve(`./src/templates/sermon.js`),
        context: {node}
    })
}

const createLanguageSermons = async (graphql, createPage, pathPrefix, language) => {
    const sermons = await getSermons(graphql, language)

    await Promise.all(sermons.map((node) => createSermon(createPage, node, pathPrefix)))
}

exports.createPages = async (graphql, createPage) => {
    await Promise.all(Object.keys(constants.languages).map((language) => {
        return createLanguageSermons(graphql, createPage, constants.languages[language].base_url, language)
    }))
};