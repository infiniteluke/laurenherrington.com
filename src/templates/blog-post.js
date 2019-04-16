import React from 'react';
import { graphql } from 'gatsby';

import Layout from '../components/Layout';
import Map from '../components/Map';
import BlogPostMeta from '../components/BlogPostMeta';
import Loading from '../components/Loading';
import MapHelper from '../components/MapHelper';
import { Content } from '../styles';

const topoPromise = import('../utils/topo.json');

const BlogPostTemplate = ({ data, location }) => {
  const [topo, setTopo] = React.useState(null);
  React.useEffect(() => {
    topoPromise.then(data => setTopo(data.default));
  }, [topoPromise]);
  const post = data.contentfulPost;
  return (
    <Layout location={location} {...data.site.siteMetadata}>
      <article>
        <h1 className="section-headline">{post.title}</h1>
        <BlogPostMeta
          createdAt={post.createdAt}
          timeToRead={post.body.childMarkdownRemark.timeToRead}
        />
        <Content
          dangerouslySetInnerHTML={{
            __html: post.body.childMarkdownRemark.html,
          }}
        />
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
              <Map locations={post.locations} topo={topo} />
            )}
          </div>
        )}
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
      createdAt
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
          excerpt(pruneLength: 200)
          html
        }
      }
    }
  }
`;

export default BlogPostTemplate;
