import React from 'react';
import { formatpostDate, formatReadingTime } from '../utils/helpers';

export default ({ postedAt, timeToRead }) => (
  <p>
    {formatpostDate(postedAt)}
    {` • ${formatReadingTime(timeToRead)}`}
  </p>
);
