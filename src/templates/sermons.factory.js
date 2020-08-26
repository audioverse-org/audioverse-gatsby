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
    const queryPages = await queries.getPages(
        graphql,
        query,
        {language: langKey, first: queries.NUM_PER_PAGE},
        'data.avorg.sermons'
    ),
        nodes = queryPages.map(p => _.get(p, 'nodes')).flat(),
        baseUrl = constants.languages[langKey].base_url,
        sermonCount = nodes.length,
        pageSize = 10,
        pageCount = Math.ceil(sermonCount / pageSize),
        pageNumbers = Array.from(Array(pageCount).keys()),
        pages = pageNumbers.map(i => nodes.slice(i, i + pageSize))

    await Promise.all([
        ...pages.map((p, i) => createPage({
            path: `${baseUrl}/sermons/page/${i + 1}`,
            component: path.resolve(`./src/templates/sermons.list.js`),
            context: {
                pagination: {
                    total: pageCount,
                    current: i + 1
                },
                lang: baseUrl,
                nodes: p
            }
        })),
        ...nodes.map(node => createPage({
            path: `${baseUrl}/sermons/${_.get(node, 'id')}`,
            component: path.resolve(`./src/templates/sermons.detail.js`),
            context: {node}
        }))
    ])
}

exports.createPages = async (graphql, createPage) => {
    const langKeys = Object.keys(constants.languages)

    await Promise.all(langKeys.map((key) => createPagesByLang(key, graphql, createPage)))
};
