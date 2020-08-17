const constants = require(`./src/constants`)

console.log(`env: ${constants.environment}`)

module.exports = {
    siteMetadata: {
        title: `AudioVerse`,
        description: `A website dedicated to spreading God's word through free sermon audio and much more.`,
        author: `@gatsbyjs`,
    },
    plugins: [
        `gatsby-plugin-react-helmet`,
        {
            resolve: `gatsby-source-filesystem`,
            options: {
                name: `images`,
                path: `${__dirname}/src/images`,
            },
        },
        {
            resolve: "gatsby-source-graphql",
            options: {
                typeName: "AVORG",
                fieldName: "avorg",
                url: "https://graphql.audioverse.org/graphql"
            }
        },
        `gatsby-transformer-sharp`,
        `gatsby-plugin-sharp`,
        `gatsby-plugin-sass`,
        {
            resolve: `gatsby-plugin-manifest`,
            options: {
                name: `AudioVerse`,
                short_name: `AudioVerse`,
                start_url: `/`,
                background_color: `#be2200`,
                theme_color: `#be2200`,
                display: `minimal-ui`,
                icon: `src/images/audioverse-icon.png`, // This path is relative to the root of the site.
                icon_options: {
                    // For all the options available, please see:
                    // https://developer.mozilla.org/en-US/docs/Web/Manifest
                    // https://w3c.github.io/manifest/#purpose-member
                    purpose: `maskable`,
                },
            },
        },
        // this (optional) plugin enables Progressive Web App + Offline functionality
        // To learn more, visit: https://gatsby.dev/offline
        `gatsby-plugin-offline`,
    ],
}
