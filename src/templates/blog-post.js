import React from 'react';
import styled from 'styled-components';
import { graphql, Link } from 'gatsby';

import Layout from '../components/Layout';
import Map from '../components/Map';
import BlogPostMeta from '../components/BlogPostMeta';
import Loading from '../components/Loading';
import MapHelper from '../components/MapHelper';
import Heart from '../components/Heart';
import { Content } from '../styles';

const topoPromise = import('../utils/topo.json');

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
  const [topo, setTopo] = React.useState(null);
  React.useEffect(() => {
    topoPromise.then(data => setTopo(data.default));
  }, [topoPromise]);
  const post = data.contentfulPost;
  return (
    <Layout
      location={location}
      {...data.site.siteMetadata}
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
            {!topo ? (
              <Loading />
            ) : (
              <Map locations={post.locations} topo={topo} zoom={30} />
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
