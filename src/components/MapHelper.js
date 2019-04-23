import React from 'react';

const MediaQuery = React.lazy(() => import('react-responsive'));

export default () => (
  <React.Fragment>
    <p style={{ fontSize: '.9rem', textAlign: 'center' }}>
      Click a country or a marker to see more posts from that location.{' '}
      {typeof window !== 'undefined' && (
        <React.Suspense fallback={null}>
          <MediaQuery maxWidth={1000}>
            {'\n'}Use two fingers to pan around the map.
          </MediaQuery>
        </React.Suspense>
      )}
    </p>
  </React.Fragment>
);
