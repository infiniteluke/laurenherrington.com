import React from 'react';
import { Link, graphql } from 'gatsby';
import slugify from 'slugify';
import styled from 'styled-components';
import {
  ComposableMap,
  ZoomableGroup,
  Geographies,
  Geography,
  Markers,
  Marker,
} from 'react-simple-maps';
import Helmet from 'react-helmet';

import { MarkerCircle } from '../styles';
import Layout from '../components/Layout';
import MapHelper from '../components/MapHelper';

const GlobeHelpText = styled.div`
  text-align: center;
  margin-bottom: 30px;
`;

const MarkerText = styled.text`
  fill: ${({ theme }) => theme.compAccent};
  font-size: 1.3rem;
  &:hover {
    fill: ${({ theme }) => theme.compAccentMuted};
    cursor: pointer;
  }
  &:active {
    cursor: pointer;
  }

  @media (min-width: 768px) {
    font-size: 0.9rem;
  }
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
          <ComposableMap
            height={'700'}
            width={'900'}
            projectionConfig={{
              scale: 205,
              rotation: [0, 0, 0],
            }}
            style={{
              width: '100%',
              height: 'auto',
            }}
          >
            <ZoomableGroup
              style={{ outline: 'none' }}
              disablePanning
              zoom="1.1"
              center={[0, 0]}
            >
              <Geographies geography={topo}>
                {(geographies, projection) =>
                  geographies.map((geography, i) => (
                    <Link
                      to={`/place/country/${slugify(
                        geography.properties.NAME.toLocaleLowerCase()
                      )}`}
                    >
                      <Geography
                        style={{
                          pressed: { fill: '#141823', cursor: 'pointer' },
                          hover: { fill: '#2b2f38', cursor: 'pointer' },
                        }}
                        key={geography.id}
                        geography={geography}
                        projection={projection}
                      />
                    </Link>
                  ))
                }
              </Geographies>
              <Markers>
                {locations.map(
                  ({ coordinates, id, name, fields: { nameSlug } }) => (
                    <Marker
                      key={id}
                      marker={{ coordinates: Object.values(coordinates) }}
                    >
                      <Link to={`/place/name/${nameSlug}`}>
                        <MarkerCircle cx={0} cy={0} r={6} />
                        <MarkerText textAnchor="middle" y={30}>
                          {name}
                        </MarkerText>
                      </Link>
                    </Marker>
                  )
                )}
              </Markers>
            </ZoomableGroup>
          </ComposableMap>
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
