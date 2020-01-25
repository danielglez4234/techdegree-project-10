import React from 'react';
import { Link } from 'react-router-dom';

const NotFound = () => {
  return(
    <div className="bounds">
      <h1>Not Found</h1>
      <h2 className="notFound_404">404</h2>
      <p>Sorry! We couldn't find the page you're looking for.</p>
      <Link className="button button-secondary" to="/courses">Return to List</Link>
    </div>
  );
}


export default NotFound;
