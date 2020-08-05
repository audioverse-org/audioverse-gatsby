const path = require(`path`),
    constants = require(`../constants.js`)

exports.createPages = async (graphql, createPage) => {
    await Promise.all(Object.keys(constants.languages).map(async (key) => {
        const lang = constants.languages[key]

        const result = await graphql(`
{
    avorg {
        sermons(language:${key}) {
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
        const nodes = result?.data?.avorg?.sermons?.nodes

        await createPage({
            path: `${lang.base_url}/sermons`,
            component: path.resolve(`./src/templates/sermons.js`),
            context: {nodes}
        })
    }))
}