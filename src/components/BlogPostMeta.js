import React from 'react';
import { formatPostDate, formatReadingTime } from '../utils/helpers';

export default ({ createdAt, timeToRead }) => (
  <p>
    {formatPostDate(createdAt)}
    {` • ${formatReadingTime(timeToRead)}`}
  </p>
);
