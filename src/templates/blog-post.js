import React from 'react';
import styled from 'styled-components';
import { graphql, Link } from 'gatsby';
import Helmet from 'react-helmet';

import Layout from '../components/Layout';
import BlogPostMeta from '../components/BlogPostMeta';
import Loading from '../components/Loading';
import MapHelper from '../components/MapHelper';
import Heart from '../components/Heart';
import { Content } from '../styles';

import Facebook from '../components/icons/Facebook';
import Twitter from '../components/icons/Twitter';

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
  pageContext: { slug, next, previous },
}) => {
  const post = data.contentfulPost;
  const siteMetadata = data.site.siteMetadata;
  const categories = data.allContentfulCategory.categories;
  const postUrl = `${siteMetadata.siteUrl}/post/${slug}`;
  return (
    <Layout
      location={location}
      title={post.title}
      categories={categories}
      category={post.category.slug}
    >
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
          <section
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
          </section>
        )}
        <section
          style={{
            margin: '60px 0',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexDirection: 'column',
            width: '100%',
          }}
        >
          <h2>
            Share this post{' '}
            <span aria-label="information desk woman" role="img">
              💁‍
            </span>
          </h2>
          <div>
            <a
              target="_blank"
              rel="noopener noreferrer"
              href={`https://www.facebook.com/sharer/sharer.php?u=${postUrl}`}
            >
              <Facebook />
            </a>
            <a
              target="_blank"
              rel="noopener noreferrer"
              href={`https://twitter.com/home?status="${
                post.body.childMarkdownRemark.excerpt
              }"
              ${postUrl}`}
            >
              <Twitter />
            </a>
          </div>
        </section>
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
      <Helmet>
        <script
          async
          defer
          src="//cdn.embedly.com/widgets/platform.js"
          charSet="UTF-8"
        />
      </Helmet>
    </Layout>
  );
};

export const pageQuery = graphql`
  query PostQuery($slug: String) {
    site {
      siteMetadata {
        siteUrl
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
        country
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
