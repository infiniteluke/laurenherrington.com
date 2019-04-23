import React from 'react';
import { Link } from 'gatsby';
import {
  ZoomableGroup,
  Geographies,
  Geography,
  Markers,
  Marker,
} from 'react-simple-maps';
import {
  MapLabel,
  StyledComposableMap,
  MarkerCircle,
  MarkerText,
} from '../styles';
import slugify from 'slugify';

export default ({
  locations,
  topo,
  showLabelOnHover = false,
  center = Object.values(locations[0].coordinates) || [0, 0],
  zoom = 10,
  markerSize = 14,
  height = 900,
  width = 900,
}) => {
  const [zoomState, setZoom] = React.useState(zoom);
  const [hovering, setHover] = React.useState(null);
  React.useEffect(() => {
    setZoom(zoom);
  }, [zoom]);

  return (
    <div
      style={{
        position: 'relative',
        height: 'auto',
        width: '100%',
      }}
    >
      <div
        style={{
          position: 'absolute',
          display: 'flex',
          right: 0,
          paddingRight: '10px',
          paddingTop: '10px',
        }}
      >
        <MapLabel htmlFor="zoom">Zoom</MapLabel>
        <input
          type="range"
          id="start"
          name="zoom"
          min="3"
          max="90"
          value={zoomState}
          onChange={e => setZoom(e.target.value)}
        />
      </div>
      <StyledComposableMap height={height} width={width}>
        <ZoomableGroup
          style={{ outline: 'none' }}
          center={center}
          zoom={Number(zoomState)}
        >
          <Geographies geography={topo}>
            {(geographies, projection) =>
              geographies.map(geography => (
                <Link
                  key={geography.properties.NAME}
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
                    <MarkerCircle
                      cx={0}
                      cy={0}
                      r={markerSize}
                      onMouseEnter={() => setHover(nameSlug)}
                      onMouseLeave={() => setHover(null)}
                      onTouchStart={() => setHover(nameSlug)}
                      onTouchEnd={() => setHover(null)}
                    />
                    {showLabelOnHover ? (
                      hovering === nameSlug ? (
                        <MarkerText textAnchor="middle" y={-40}>
                          {name}
                        </MarkerText>
                      ) : null
                    ) : (
                      <MarkerText textAnchor="middle" y={-40}>
                        {name}
                      </MarkerText>
                    )}
                  </Link>
                </Marker>
              )
            )}
          </Markers>
        </ZoomableGroup>
      </StyledComposableMap>
    </div>
  );
};
