import _ from 'lodash';
import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { RootState } from '@/types/redux';
import { routerPath } from '@/router/common';

const Home = (): React.ReactElement => {
  const history = useHistory();
  const user = useSelector((state: RootState) => state.user);

  useEffect(() => {
    if (_.isEmpty(user.access_token)) {
      history.push(routerPath.LOGIN);
    }
  }, [user]);

  return (
    <div className="home-container container">
      <Helmet>
        <title>Home | Docker Laravel</title>
      </Helmet>
      <div className="row my-5">
        <div className="col">
          <h4 className="mb-5">Home</h4>
          <p>
            Lorem ipsum dolor sit amet, consectetur adipisicing elit. Ad aperiam aspernatur cupiditate deserunt
            distinctio, esse hic inventore ipsum odit officia pariatur porro quia quidem ratione temporibus! Eius
            numquam quae repellat!
          </p>
        </div>
      </div>
    </div>
  );
};

export default Home;
