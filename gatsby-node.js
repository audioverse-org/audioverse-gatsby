/**
 * Implement Gatsby's Node APIs in this file.
 *
 * See: https://www.gatsbyjs.org/docs/node-apis/
 */

const sermonFactory = require('./src/templates/sermon.factory.js'),
    sermonsFactory = require('./src/templates/sermons.factory.js')

exports.createPages = async ({graphql, actions}) => {
    const {createPage} = actions

    await sermonFactory.createPages(graphql, createPage)
    await sermonsFactory.createPages(graphql, createPage)
}