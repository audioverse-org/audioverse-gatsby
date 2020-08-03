/**
 * Implement Gatsby's Node APIs in this file.
 *
 * See: https://www.gatsbyjs.org/docs/node-apis/
 */

const factory = require('./src/templates/sermon.factory.js')

exports.createPages = async ({graphql, actions}) => {
    const {createPage} = actions

    await factory.createSermons(graphql, createPage)
}