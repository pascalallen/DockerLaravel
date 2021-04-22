import React from 'react';
import { Helmet } from 'react-helmet-async';

const PrivacyPolicy = () => {
  return (
    <div className="container">
      <Helmet>
        <title>Privacy Policy | Docker Laravel</title>
      </Helmet>
      <div className="row my-5">
        <div className="col">
          <h1>Privacy Policy</h1>
          <p>
            Lorem ipsum dolor sit amet, consectetur adipisicing elit. Adipisci asperiores beatae commodi, consequatur
            cumque debitis delectus dolor est illo nostrum porro quis ratione repellat tempora temporibus vel veniam
            voluptate voluptates!
          </p>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
