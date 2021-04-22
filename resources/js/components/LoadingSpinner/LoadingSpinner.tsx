import React from 'react';

const LoadingSpinner = (): React.ReactElement => {
  return (
    <div className="text-center">
      <div className="spinner-border spinner-border-sm mr-1" role="status">
        <span className="sr-only">Loading...</span>
      </div>
    </div>
  );
};

export default LoadingSpinner;
