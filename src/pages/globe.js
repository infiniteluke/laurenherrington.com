import React from 'react';
import { graphql } from 'gatsby';
import styled from 'styled-components';
import Helmet from 'react-helmet';

import Layout from '../components/Layout';
import Map from '../components/Map';
import MapHelper from '../components/MapHelper';

const GlobeHelpText = styled.div`
  text-align: center;
  margin-bottom: 30px;
`;

const topoPromise = import('../utils/topo.json');

export default ({ data, location }) => {
  const [topo, setTopo] = React.useState(null);
  React.useEffect(() => {
    topoPromise.then(data => setTopo(data.default));
  }, [topoPromise]);
  const siteTitle = data.site.siteMetadata.title;
  const locations = data.allContentfulLocation.locations.length
    ? data.allContentfulLocation.locations.map(l => l.location)
    : [];
  return (
    <Layout location={location} {...data.site.siteMetadata}>
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
          <Map
            locations={locations}
            topo={topo}
            height={900}
            width={1000}
            zoom={2}
            markerSize={9}
            center={[0, 10]}
          />
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
