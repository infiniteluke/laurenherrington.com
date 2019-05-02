import React from 'react';
import { graphql } from 'gatsby';
import Helmet from 'react-helmet';
import Layout from '../components/Layout';
import BlogPost from '../components/BlogPost';
import StoryCircle from '../components/StoryCircle';
import HeroImage from '../components/HeroImage';

import { Stories } from '../styles';

class CategoryTemplate extends React.Component {
  render() {
    const pageContext = this.props.pageContext;
    const siteTitle = this.props.data.site.siteMetadata.title;
    const categories = this.props.data.allContentfulCategory.categories;
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
          <Stories>
            {categories.map(
              ({ category: { id, title, image, slug, directLink } }) => (
                <StoryCircle
                  key={id}
                  title={title}
                  image={image}
                  to={directLink ? `/${slug}` : `/tag/${slug}`}
                />
              )
            )}
          </Stories>
          {posts.length ? (
            <React.Fragment>
              <HeroImage
                title={`"${category.title} posts"`}
                image={category.hero}
              />
              {posts.map(post => (
                <BlogPost key={post.id} post={post} />
              ))}
            </React.Fragment>
          ) : (
            <h2 style={{ textAlign: 'center', paddingTop: '40px' }}>{`No "${
              pageContext.title
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
    allContentfulCategory(sort: { fields: weight }) {
      categories: edges {
        category: node {
          id
          slug
          title
          directLink
          image {
            ...squareImageSmall
          }
        }
      }
    }
    contentfulCategory(slug: { eq: $slug }) {
      title
      hero: image {
        ...squareImageLarge
      }
    }
    allContentfulPost(
      limit: 1000
      filter: { category: { slug: { eq: $slug } } }
      sort: { fields: fields___postedAt, order: DESC }
    ) {
      posts: edges {
        post: node {
          category {
            slug
            title
          }
          slug
          id
          fields {
            postedAt
          }
          title
          body {
            childMarkdownRemark {
              timeToRead
              excerpt(pruneLength: 140)
              html
            }
          }
        }
      }
    }
  }
  fragment hero on ContentfulAsset {
    title
    fluid(maxWidth: 1200, maxHeight: 600) {
      ...GatsbyContentfulFluid_withWebp
    }
  }
`;
