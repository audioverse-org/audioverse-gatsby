const _ = require(`lodash`),
    path = require(`path`),
    constants = require(`../constants.js`),
    queries = require(`../helpers/queries`)

const query = `
query loadPagesQuery($language: AVORG_Language!, $cursor: String) {
    avorg {
        sermons(language: $language, after: $cursor, orderBy: {direction: DESC, field: CREATED_AT}) {
            pageInfo {
                hasNextPage
                endCursor
            }
            aggregate {
                count
            }
        }
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
        {language: langKey},
        'data.avorg.sermons'
    )

    await Promise.all(pages.map((page, i) => {
        const baseUrl = constants.languages[langKey].base_url,
            nodes = _.get(page, 'nodes'),
            sermonCount = _.get(page, 'aggregate.count', 0),
            cursor = _.get(page, 'pageInfo.endCursor'),
            pageNumber = i + 1

        return createPage({
            path: `${baseUrl}/sermons/page/${pageNumber}`,
            component: path.resolve(`./src/templates/sermons.js`),
            context: {
                nodes,
                pagination: {
                    total: Math.ceil(sermonCount / 10),
                    current: pageNumber
                },
                language: langKey,
                cursor
            }
        })
    }))
}

exports.createPages = async (graphql, createPage) => {
    const langKeys = Object.keys(constants.languages)

    await Promise.all(langKeys.map((key) => createPagesByLang(key, graphql, createPage)))
}
