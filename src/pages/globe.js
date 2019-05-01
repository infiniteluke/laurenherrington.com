import React from 'react';
import { graphql } from 'gatsby';
import styled from 'styled-components';
import Helmet from 'react-helmet';

import Layout from '../components/Layout';
import MapHelper from '../components/MapHelper';
import Loading from '../components/Loading';
import StoryCircle from '../components/StoryCircle';
import { Stories } from '../styles';

const GlobeHelpText = styled.div`
  text-align: center;
  margin-bottom: 30px;
`;

const Map = React.lazy(() => import('../components/Map'));

export default ({ data, location }) => {
  const siteTitle = data.site.siteMetadata.title;
  const categories = data.allContentfulCategory.categories;
  const locations = data.allContentfulLocation.locations.length
    ? data.allContentfulLocation.locations.map(l => l.location)
    : [];
  return (
    <Layout location={location} {...data.site.siteMetadata}>
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
      <section>
        <Helmet title={siteTitle} />
        <h1 style={{ marginBottom: '40px', textAlign: 'center' }}>
          Posts by Location{' '}
          <span role="img" aria-label="map emoji">
            🗺
          </span>
        </h1>
        <GlobeHelpText>
          <MapHelper />
        </GlobeHelpText>
        <div
          style={{
            width: '100%',
            margin: '0 auto',
          }}
        >
          {typeof window !== 'undefined' && (
            <React.Suspense
              fallback={
                <div style={{ margin: '118px 0', textAlign: 'center' }}>
                  <Loading />
                </div>
              }
            >
              <Map
                locations={locations}
                showLabelOnHover={true}
                height={900}
                width={1000}
                zoom={1.7}
                markerSize={10}
                center={[0, 10]}
              />
            </React.Suspense>
          )}
        </div>
      </section>
    </Layout>
  );
};

export const pageQuery = graphql`
  query GlobeQuery {
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
    allContentfulLocation(limit: 1000) {
      locations: edges {
        location: node {
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
          country
        }
      }
    }
  }
`;
