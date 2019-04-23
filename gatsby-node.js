const path = require('path');
const slugify = require('slugify');

exports.createPages = ({ graphql, actions }) => {
  const { createPage } = actions;

  const BlogPost = path.resolve(`./src/templates/blog-post.js`);
  const Category = path.resolve(`./src/templates/category.js`);
  const Place = path.resolve(`./src/templates/place.js`);
  return graphql(
    `
      {
        allContentfulPost {
          posts: edges {
            post: node {
              slug
              title
              postDate
              createdAt
              id
            }
          }
        }
        allContentfulCategory {
          categories: edges {
            category: node {
              slug
              id
            }
          }
        }
        allContentfulLocation(limit: 1000) {
          locations: edges {
            location: node {
              id
              name
              country
            }
          }
        }
      }
    `
  ).then(result => {
    if (result.errors) {
      throw result.errors;
    }

    // Create blog posts pages.
    const { locations } = result.data.allContentfulLocation;
    const { posts } = result.data.allContentfulPost;
    const { categories } = result.data.allContentfulCategory;
    categories.forEach(({ category }, index) => {
      createPage({
        path: `tag/${category.slug}`,
        component: Category,
        context: {
          slug: category.slug,
        },
      });
    });
    locations.forEach(({ location }, index) => {
      if (location.name) {
        const slug = slugify(location.name.toLocaleLowerCase());
        createPage({
          path: `place/name/${slug}`,
          component: Place,
          context: {
            place: location.name,
          },
        });
      }
      if (location.country) {
        const slug = slugify(location.country.toLocaleLowerCase());
        createPage({
          path: `place/country/${slug}`,
          component: Place,
          context: {
            place: location.country,
          },
        });
      }
    });
    posts.forEach(({ post }, index) => {
      const previous =
        index === posts.length - 1 ? null : posts[index + 1].post;
      const next = index === 0 ? null : posts[index - 1].post;
      createPage({
        path: `post/${post.slug}`,
        component: BlogPost,
        context: {
          slug: post.slug,
          previous,
          next,
        },
      });
    });
  });
};

exports.onCreateNode = ({ node, actions, getNode }) => {
  const { createNodeField } = actions;
  if (node.internal.type === 'ContentfulLocation') {
    createNodeField({
      name: 'nameSlug',
      node,
      value: slugify(node.name.toLocaleLowerCase()),
    });
    createNodeField({
      name: 'countrySlug',
      node,
      value: slugify(node.country.toLocaleLowerCase()),
    });
  }
  if (node.internal.type === 'ContentfulPost') {
    createNodeField({
      name: 'postedAt',
      node,
      value: node.postDate ? `${node.postDate}T16:00:00.000Z` : node.createdAt,
    });
  }
};
