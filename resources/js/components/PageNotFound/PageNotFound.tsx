import React from 'react';
import { Helmet } from 'react-helmet-async';
import { useHistory } from 'react-router-dom';
import Path from '@/router/Path';

const PageNotFound = (): React.ReactElement => {
  const history = useHistory();

  return (
    <div className="page-not-found-container container text-center">
      <Helmet>
        <title>404 Page Not Found | Docker Laravel</title>
      </Helmet>
      <div className="row">
        <div className="col-md-4 offset-md-4">
          <h4>404 | Page Not Found</h4>
          <a
            className="btn btn-primary mt-5"
            href={Path.HOME}
            onClick={(event): void => {
              event.preventDefault();
              history.push(Path.HOME);
            }}
            role="button"
            tabIndex={1}>
            Go Back
          </a>
        </div>
      </div>
    </div>
  );
};

export default PageNotFound;
