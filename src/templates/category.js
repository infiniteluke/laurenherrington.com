import React from 'react';
import { graphql } from 'gatsby';
import Helmet from 'react-helmet';
import Layout from '../components/Layout';
import BlogPost from '../components/BlogPost';

class CategoryTemplate extends React.Component {
  render() {
    const pageContext = this.props.pageContext;
    const siteTitle = this.props.data.site.siteMetadata.title;
    const category = this.props.data.contentfulCategory;
    const posts = this.props.data.allContentfulPost
      ? this.props.data.allContentfulPost.posts.map(p => p.post)
      : [];
    return (
      <Layout
        location={this.props.location}
        {...this.props.data.site.siteMetadata}
      >
        <section>
          <Helmet title={siteTitle} />
          {posts.length ? (
            <>
              <h1 style={{ marginBottom: '40px', textAlign: 'center' }}>{`"${
                category.title
              }" posts`}</h1>
              {posts.map(post => (
                <BlogPost key={post.id} post={post} />
              ))}
            </>
          ) : (
            <h2 style={{ textAlign: 'center' }}>{`No "${
              pageContext.slug
            }" posts.. yet 😉`}</h2>
          )}
        </section>
      </Layout>
    );
  }
}

export default CategoryTemplate;

export const pageQuery = graphql`
  query CategoryPostsQuery($slug: String) {
    site {
      siteMetadata {
        title
      }
    }
    contentfulCategory(slug: { eq: $slug }) {
      title
    }
    allContentfulPost(
      limit: 1000
      filter: { category: { slug: { eq: $slug } } }
    ) {
      posts: edges {
        post: node {
          category {
            slug
            title
          }
          slug
          id
          createdAt
          title
          body {
            childMarkdownRemark {
              timeToRead
              excerpt(pruneLength: 200)
              html
            }
          }
        }
      }
    }
  }
`;
