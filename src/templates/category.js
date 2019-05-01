import React from 'react';
import { graphql } from 'gatsby';
import styled from 'styled-components';
import Img from 'gatsby-image';
import Helmet from 'react-helmet';
import Layout from '../components/Layout';
import BlogPost from '../components/BlogPost';
import StoryCircle from '../components/StoryCircle';

import { Stories } from '../styles';

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

const ImageFilter = styled.div`
  position: absolute;
  z-index: 1;
  width: 100%;
  height: 100%;
  background-image: ${({ theme }) =>
    `linear-gradient(${theme.dark}, ${theme.darkMuted})`};
  opacity: 0.5;
`;

const Hero = styled.div`
  position: relative;
  margin-bottom: 40px;
  width: 100vw;
  position: relative;
  left: 50%;
  margin-left: -50vw;
`;

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
                  to={directLink ? slug : `tag/${slug}`}
                />
              )
            )}
          </Stories>
          {posts.length ? (
            <React.Fragment>
              <Hero>
                <ImageFilter />
                <CategoryTitle>{`"${category.title}" posts`}</CategoryTitle>
                <Img
                  style={{
                    height: '400px',
                  }}
                  alt={category.hero.title}
                  fluid={category.hero.fluid}
                />
              </Hero>
              {posts.map(post => (
                <BlogPost key={post.id} post={post} />
              ))}
            </React.Fragment>
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
