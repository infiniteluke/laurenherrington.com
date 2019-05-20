import React from 'react';

export default ({ link, children }) => (
  <a target="_blank" rel="noopener noreferrer" href={link}>
    {children}
  </a>
);
