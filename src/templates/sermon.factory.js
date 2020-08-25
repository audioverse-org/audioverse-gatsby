const _ = require(`lodash`),
    path = require(`path`),
    constants = require(`../constants.js`),
    queries = require(`../helpers/queries`)

const query = `
query loadPagesQuery($language: AVORG_Language!, $cursor: String) {
  avorg {
    sermons(language: $language, first: 50, after: $cursor, orderBy: {direction: DESC, field: CREATED_AT}) {
      nodes {
        id
        title
        persons {
            name
        }
        audioFiles {
            url
        }
        recordingDate
        description
        imageWithFallback {
            url(size: 50)
        }
      }
      pageInfo {
        hasNextPage
        endCursor
      }
    }
  }
}`

const getSermons = async (graphql, language = "ENGLISH") => {
    const pages = await queries.getPages(
        graphql,
        query,
        {language},
        'data.avorg.sermons'
    )

    return pages.map(p => p.nodes).flat()
}

const createSermon = async (createPage, node, pathPrefix) => {
    const nodeId = _.get(node, 'id')

    await createPage({
        path: `${pathPrefix}/sermons/${nodeId}`,
        component: path.resolve(`./src/templates/sermon.js`),
        context: {node}
    })
}

const createLanguageSermons = async (graphql, createPage, pathPrefix, language) => {
    const sermons = await getSermons(graphql, language)

    await Promise.all(sermons.map(node => createSermon(createPage, node, pathPrefix)))
}

exports.createPages = async (graphql, createPage) => {
    await Promise.all(Object.keys(constants.languages).map((language) => {
        return createLanguageSermons(
            graphql,
            createPage,
            constants.languages[language].base_url,
            language
        )
    }))
};
