const path = require(`path`),
    constants = require(`../constants.js`)

const createPagesByLang = async (
    langKey,
    graphql,
    createPage,
    page = 1,
    cursor = null
) => {
    const lang = constants.languages[langKey]

    const result = await graphql(`
{
    avorg {
        sermons(language:${langKey}, after:"${cursor}") {
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
    }
}
`)
    const sermons = result &&
        result.data &&
        result.data.avorg &&
        result.data.avorg.sermons

    const nodes = sermons && sermons.nodes

    await createPage({
        path: `${lang.base_url}/sermons/page/${page}`,
        component: path.resolve(`./src/templates/sermons.js`),
        context: {nodes}
    })

    const hasNextPage = sermons &&
        sermons.pageInfo &&
        sermons.pageInfo.hasNextPage

    if (hasNextPage) {
        const endCursor = sermons &&
            sermons.pageInfo &&
            sermons.pageInfo.endCursor

        await createPagesByLang(
            langKey,
            graphql,
            createPage,
            page + 1,
            endCursor
        )
    }
}

exports.createPages = async (graphql, createPage) => {
    const langKeys = Object.keys(constants.languages)

    await Promise.all(langKeys.map(async (key) => {
        return await createPagesByLang(key, graphql, createPage)
    }))
}