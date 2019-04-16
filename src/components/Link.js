import React from 'react';
import { Link } from 'gatsby';

export default ({ children, className, ...rest }) => (
  <Link className={`${className}`} {...rest}>
    {children}
  </Link>
);
