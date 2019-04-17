import React from 'react';
import styled from 'styled-components';
import { Link } from 'gatsby';
import {
  ComposableMap,
  ZoomableGroup,
  Geographies,
  Geography,
  Markers,
  Marker,
} from 'react-simple-maps';
import slugify from 'slugify';

const MarkerCircle = styled.circle`
  fill: ${({ theme }) => theme.compAccent};
  transition: all 0.2s ease;
  &:hover {
    fill: ${({ theme }) => theme.compAccentMuted};
    cursor: pointer;
    r: ${({ r }) => r * 1.3};
  }
  &:active {
    cursor: pointer;
    r: ${({ r }) => r * 1.6};
  }
`;

const MarkerText = styled.text`
  fill: ${({ theme }) => theme.compAccent};
  font-size: 1.2rem;
  &:hover {
    fill: ${({ theme }) => theme.compAccentMuted};
    cursor: pointer;
  }
  &:active {
    cursor: pointer;
  }
`;

const Label = styled.label`
  color: ${({ theme }) => theme.compAccent};
  font-size: 0.8rem;
  padding-right: 10px;
`;

export default ({ zoom = 10, center, locations, topo, markerSize = 12 }) => {
  const [zoomState, setZoom] = React.useState(zoom);
  return (
    <div style={{ position: 'relative' }}>
      <div
        style={{
          position: 'absolute',
          right: 0,
          paddingRight: '10px',
          paddingTop: '10px',
        }}
      >
        <Label htmlFor="zoom">Zoom</Label>
        <input
          type="range"
          id="start"
          name="zoom"
          min="1"
          max="20"
          value={zoomState}
          onChange={e => setZoom(e.target.value)}
        />
      </div>
      <ComposableMap
        height={'300'}
        width={'900'}
        style={{ width: '100%', height: 'auto' }}
      >
        <ZoomableGroup
          disablePanning
          style={{ outline: 'none' }}
          center={center || Object.values(locations[0].coordinates)}
          zoom={Number(zoomState)}
        >
          <Geographies geography={topo}>
            {(geographies, projection) =>
              geographies.map(geography => (
                <Link
                  to={`/place/country/${slugify(
                    geography.properties.NAME.toLocaleLowerCase()
                  )}`}
                >
                  <Geography
                    style={{
                      pointerEvents: 'none',
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
                    <MarkerCircle cx={0} cy={0} r={markerSize} />
                    <MarkerText textAnchor="middle" y={40}>
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
  );
};
