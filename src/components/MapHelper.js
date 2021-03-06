import React from 'react';
import MediaQuery from 'react-responsive';

export default () => (
  <React.Fragment>
    <p style={{ fontSize: '.9rem', textAlign: 'center' }}>
      Click a country or a marker to see more posts from that location.{' '}
      <MediaQuery maxWidth={1000}>
        {'\n'}Use two fingers to pan around the map.
      </MediaQuery>
    </p>
  </React.Fragment>
);
