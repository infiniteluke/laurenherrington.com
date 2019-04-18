import React from 'react';
import { graphql } from 'gatsby';
import styled from 'styled-components';
import Img from 'gatsby-image';
import Helmet from 'react-helmet';
import Layout from '../components/Layout';
import BlogPost from '../components/BlogPost';

const CategoryTitle = styled.h1`
  font-size: 2.5rem;
  margin-bottom: 40px;
  text-align: center;
  position: absolute;
  z-index: 2;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  color: ${({ theme }) => theme.bg};
  @media (min-width: 768px) {
    font-size: 3.5rem;
  }
`;

const Hero = styled.div`
  position: absolute;
  z-index: 1;
  width: 100%;
  height: 100%;
  background-image: ${({ theme }) =>
    `linear-gradient(${theme.dark}, ${theme.darkMuted})`};
  opacity: 0.4;
`;

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
              <div
                style={{
                  position: 'relative',
                  marginBottom: '40px',
                }}
              >
                <Hero />
                <CategoryTitle>{`"${category.title}" posts`}</CategoryTitle>
                <Img alt={category.hero.title} fluid={category.hero.fluid} />
              </div>
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
      hero: image {
        ...squareImageLarge
      }
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
  fragment hero on ContentfulAsset {
    title
    fluid(maxWidth: 1200, maxHeight: 600) {
      ...GatsbyContentfulFluid_withWebp
    }
  }
`;
