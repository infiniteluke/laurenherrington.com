import React from 'react';
import styled from 'styled-components';
import { graphql, Link } from 'gatsby';

import Layout from '../components/Layout';
import BlogPostMeta from '../components/BlogPostMeta';
import Loading from '../components/Loading';
import MapHelper from '../components/MapHelper';
import Heart from '../components/Heart';
import StoryCircle from '../components/StoryCircle';
import { Content, Stories } from '../styles';

const Map = React.lazy(() => import('../components/Map'));

const ArticleFooter = styled.footer`
  display: grid;
  grid-template-columns: [previous] 50% [next] 50%;
  margin-top: 40px;
`;

const NextLink = styled(Link)`
  justify-self: end;
  grid-column-start: next;
  color: ${({ theme }) => theme.dark};
  &:visited {
    color: ${({ theme }) => theme.darkMuted};
  }
`;

const PreviousLink = styled(Link)`
  justify-self: start;
  grid-column-start: previous;
  color: ${({ theme }) => theme.dark};
  &:visited {
    color: ${({ theme }) => theme.darkMuted};
  }
`;

const BlogPostTemplate = ({
  data,
  location,
  pageContext: { next, previous },
}) => {
  const post = data.contentfulPost;
  const categories = data.allContentfulCategory.categories;
  return (
    <Layout
      location={location}
      {...data.site.siteMetadata}
      category={post.category.slug}
    >
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
      <article>
        <header style={{ marginBottom: '40px' }}>
          <h1 className="section-headline">{post.title}</h1>
          <BlogPostMeta
            postedAt={post.fields.postedAt}
            timeToRead={post.body.childMarkdownRemark.timeToRead}
          />
        </header>
        <Content
          dangerouslySetInnerHTML={{
            __html: post.body.childMarkdownRemark.html,
          }}
        />
        <div style={{ margin: '100px 0', textAlign: 'center' }}>
          <Heart />
        </div>
        {post.locations && (
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexDirection: 'column',
              width: '100%',
              overflow: 'hidden',
            }}
          >
            <h2>
              Post location <span role="img">🗺</span>
            </h2>
            <MapHelper />
            {typeof window !== 'undefined' && (
              <React.Suspense
                fallback={
                  <div style={{ margin: '118px 0', textAlign: 'center' }}>
                    <Loading />
                  </div>
                }
              >
                <Map locations={post.locations} zoom={30} />
              </React.Suspense>
            )}
          </div>
        )}
        <ArticleFooter>
          {previous ? (
            <PreviousLink to={`/post/${previous.slug}`}>
              <span
                style={{ marginLeft: '3px' }}
                role="img"
                aria-label="forward arrow"
              >
                ⬅️
              </span>
              {previous.title}
            </PreviousLink>
          ) : null}
          {next ? (
            <NextLink to={`/post/${next.slug}`}>
              {next.title}
              <span
                style={{ marginLeft: '6px' }}
                role="img"
                aria-label="forward arrow"
              >
                ➡️
              </span>
            </NextLink>
          ) : null}
        </ArticleFooter>
      </article>
    </Layout>
  );
};

export const pageQuery = graphql`
  query PostQuery($slug: String) {
    site {
      siteMetadata {
        title
      }
    }
    allContentfulCategory {
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
    contentfulPost(slug: { eq: $slug }) {
      category {
        slug
        title
      }
      id
      fields {
        postedAt
      }
      title
      locations {
        name
        id
        fields {
          nameSlug
          countrySlug
        }
        coordinates {
          lon
          lat
        }
      }
      body {
        childMarkdownRemark {
          timeToRead
          excerpt(pruneLength: 140)
          html
        }
      }
    }
  }
`;

export default BlogPostTemplate;
