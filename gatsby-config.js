const dotenv = require('dotenv');
const shared = require('./src/utils/shared');

if (process.env.IS_GATSBY_PREVIEW !== 'true') {
  dotenv.config({
    path: `.env`,
  });
}

console.log(process.env);

const siteMetadata = {
  title: `Lauren Herrington`,
  author: `Lauren Herrington`,
  description: `Lauren Herrington's personal blog.`,
  siteUrl: `https://laurenherrington.com`,
};

const plugins = [
  'gatsby-plugin-styled-components',
  {
    resolve: `gatsby-source-contentful`,
    options: {
      spaceId: process.env.CONTENTFUL_SPACE_ID,
      accessToken:
        process.env.CONTENTFUL_PREVIEW_ACCESS_TOKEN ||
        process.env.CONTENTFUL_ACCESS_TOKEN,
      host: process.env.CONTENTFUL_HOST,
    },
  },
  {
    resolve: `gatsby-plugin-typography`,
    options: {
      pathToConfigModule: `src/utils/typography.js`,
    },
  },
  {
    resolve: `gatsby-transformer-remark`,
    options: {
      plugins: [
        {
          resolve: `gatsby-remark-images`,
          options: {
            maxWidth: 590,
          },
        },
        {
          resolve: `gatsby-remark-responsive-iframe`,
          options: {
            wrapperStyle: `margin-bottom: 1.0725rem`,
          },
        },
        {
          resolve: `gatsby-remark-images-contentful`,
          options: {
            maxWidth: 1000,
            backgroundColor: '#fde5df',
          },
        },
        `gatsby-remark-copy-linked-files`,
        `gatsby-remark-smartypants`,
      ],
    },
  },
  `gatsby-transformer-sharp`,
  `gatsby-plugin-sharp`,
  {
    resolve: `gatsby-plugin-manifest`,
    options: {
      name: `Lauren Herrington's Blog`,
      short_name: `Lauren's Blog`,
      icon: 'lauren.jpg',
      start_url: `/`,
      background_color: shared.theme.bg,
      theme_color: shared.theme.dark,
      display: `minimal-ui`,
    },
  },
  {
    resolve: `gatsby-plugin-google-analytics`,
    options: {
      trackingId: process.env.GOOGLE_ANALYTICS_TRACKING_ID,
    },
  },
  `gatsby-plugin-offline`,
  `gatsby-plugin-react-helmet`,
];

if (
  process.env.RUN_WEBPACK_BUNDLE_ANALYZER === 'true' &&
  process.env.IS_GATSBY_PREVIEW !== 'true'
) {
  plugins.push({
    resolve: 'gatsby-plugin-webpack-bundle-analyzer',
    options: {
      production: true,
    },
  });
}

module.exports = {
  siteMetadata,
  plugins,
};
