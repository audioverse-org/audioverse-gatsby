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

const createSermon = async (createPage, node, pathPrefix) => {
    await createPage({
        path: `${pathPrefix}${node.id}`,
        component: path.resolve(`./src/templates/sermon.js`),
        context: {node}
    })
}

const createLanguageSermons = async (graphql, createPage, pathPrefix, language) => {
    const sermons = await getSermons(graphql, language)

    if (!sermons) return;

    await Promise.all(sermons.map(async (node) => {
        await createSermon(createPage, node, pathPrefix)
    }))
}

const createSermons = async (graphql, createPage) => {
    const languages = {
        'ENGLISH': 'english/sermons/recordings/',
        'SPANISH': 'espanol/sermones/grabaciones/',
        'FRENCH': 'francais/predications/enregistrements/',
        // TODO: Translate route:
        'GERMAN': 'deutsch/sermons/recordings/',
        // TODO: Translate route:
        'CHINESE': 'zhongwen/sermons/recordings/',
        // TODO: Translate route:
        'JAPANESE': 'ja/sermons/recordings/',
        // TODO: Translate route:
        'RUSSIAN': 'ru/sermons/recordings/',
    }

    await Promise.all(Object.keys(languages).map(async (language) => {
        await createLanguageSermons(graphql, createPage, languages[language], language)
    }))
}

exports.createPages = async ({graphql, actions}) => {
    const {createPage} = actions

    await createSermons(graphql, createPage)
}