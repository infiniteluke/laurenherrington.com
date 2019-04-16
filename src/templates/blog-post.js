import React from 'react';
import { graphql } from 'gatsby';
import {
  ComposableMap,
  ZoomableGroup,
  Geographies,
  Geography,
  Markers,
  Marker,
} from 'react-simple-maps';

import Layout from '../components/Layout';
import BlogPostMeta from '../components/BlogPostMeta';
import Loading from '../components/Loading';
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
              height: '300px',
              width: '100%',
              overflow: 'hidden',
            }}
          >
            {!topo ? (
              <Loading />
            ) : (
              <ComposableMap>
                <ZoomableGroup
                  style={{ outline: 'none' }}
                  center={Object.values(post.locations[0].coordinates)}
                  zoom={5}
                >
                  <Geographies geography={topo}>
                    {(geographies, projection) =>
                      geographies.map(geography => (
                        <Geography
                          style={{
                            pressed: { fill: '#141823', cursor: 'pointer' },
                            hover: { fill: '#2b2f38', cursor: 'pointer' },
                          }}
                          key={geography.id}
                          geography={geography}
                          projection={projection}
                        />
                      ))
                    }
                  </Geographies>
                  <Markers>
                    {post.locations.map(({ coordinates, id, name }) => (
                      <Marker
                        key={id}
                        style={{
                          default: { fill: '#e1897c' },
                          hover: { fill: '#fbada1', cursor: 'pointer' },
                          pressed: { fill: '#fde5df', cursor: 'pointer' },
                        }}
                        marker={{ coordinates: Object.values(coordinates) }}
                      >
                        <circle cx={0} cy={0} r={10} />
                        <text
                          textAnchor="middle"
                          y={30}
                          style={{ fill: '#e1897c' }}
                        >
                          {name}
                        </text>
                      </Marker>
                    ))}
                  </Markers>
                </ZoomableGroup>
              </ComposableMap>
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
