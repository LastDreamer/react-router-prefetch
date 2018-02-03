import React from 'react';
import { Link } from 'react-router-dom';

export default () => (
  <ul>
    <li>
      <Link to="/one">Multiple prefetch</Link>
    </li>
    <li>
      <Link to="/two">Page without prefetch</Link>
    </li>
    <li>
      <Link to="/three">Single prefetch</Link>
    </li>
    <li>
      <Link to="/four">Prefetch error</Link>
    </li>
  </ul>
);
