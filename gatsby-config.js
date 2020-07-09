module.exports = {
    siteMetadata: {
        title: `AudioVerse`,
        description: `Kick off your next, great Gatsby project with this default starter. This barebones starter ships with the main Gatsby configuration files you might need.`,
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
                url: "http://audioversegraphql-env.eba-hfpuuq23.us-west-1.elasticbeanstalk.com/graphql"
            }
        },
        `gatsby-transformer-sharp`,
        `gatsby-plugin-sharp`,
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
