const _ = require(`lodash`),
    path = require(`path`),
    constants = require(`../constants.js`),
    queries = require(`../helpers/queries`)

const query = `
query loadPagesQuery($language: AVORG_Language!, $cursor: String, $first: Int!) {
    avorg {
        sermons(language: $language, first: $first, after: $cursor, orderBy: {direction: DESC, field: CREATED_AT}) {
            nodes {
                ...SermonsFragment
                ...SermonFragment
            }
            pageInfo {
                hasNextPage
                endCursor
            }
            aggregate {
                count
            }
        }
    }
}

fragment SermonsFragment on AVORG_Recording {
    id
    title
    imageWithFallback {
        url(size: 50)
    }
    persons {
        name
    }
    duration
    recordingDate
}

fragment SermonFragment on AVORG_Recording {
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
}`

const createPagesByLang = async (
    langKey,
    graphql,
    createPage
) => {
    const pages = await queries.getPages(
        graphql,
        query,
        {language: langKey, first: queries.NUM_PER_PAGE},
        'data.avorg.sermons'
    )

    await Promise.all(pages.map((page, i) => {
        const baseUrl = constants.languages[langKey].base_url,
            sermonCount = _.get(page, 'aggregate.count', 0),
            nodes = _.get(page, 'nodes'),
            pageNumber = i + 1

        return Promise.all([
            createPage({
                path: `${baseUrl}/sermons/page/${pageNumber}`,
                component: path.resolve(`./src/templates/sermons.js`),
                context: {
                    pagination: {
                        total: Math.ceil(sermonCount / 10),
                        current: pageNumber
                    },
                    lang: baseUrl,
                    nodes
                }
            }),
            ...nodes.map(node => createPage({
                    path: `${baseUrl}/sermons/${_.get(node, 'id')}`,
                    component: path.resolve(`./src/templates/sermon.js`),
                    context: {node}
                })
            )
        ]);
    }))
}

exports.createPages = async (graphql, createPage) => {
    const langKeys = Object.keys(constants.languages)

    await Promise.all(langKeys.map((key) => createPagesByLang(key, graphql, createPage)))
}
