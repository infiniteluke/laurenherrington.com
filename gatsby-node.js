const path = require(`path`);

exports.createPages = ({ graphql, actions }) => {
  const { createPage } = actions;

  const BlogPost = path.resolve(`./src/templates/blog-post.js`);
  const Category = path.resolve(`./src/templates/category.js`);
  return graphql(
    `
      {
        allContentfulPost {
          posts: edges {
            post: node {
              slug
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
      }
    `
  ).then(result => {
    if (result.errors) {
      throw result.errors;
    }

    // Create blog posts pages.
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
    posts.forEach(({ post }, index) => {
      const previous =
        index === posts.length - 1 ? null : posts[index + 1].node;
      const next = index === 0 ? null : posts[index - 1].node;
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
