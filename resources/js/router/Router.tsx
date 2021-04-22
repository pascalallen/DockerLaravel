import _ from 'lodash';
import React from 'react';
import { useSelector } from 'react-redux';
import { Switch, Route } from 'react-router-dom';
import { routerPath } from '@/router/common';
import { RootState } from '@/types/redux';
import Account from '@/pages/account/Account';
import Authenticate from '@/pages/authenticate/Authenticate';
import Home from '@/pages/home/Home';
import Login from '@/pages/login/Login';
import Navbar from '@/components/Navbar/Navbar';
import PageNotFound from '@/components/PageNotFound/PageNotFound';
import PrivacyPolicy from '@/pages/privacy-policy/PrivacyPolicy';
import Register from '@/pages/register/Register';
import RequestReset from '@/pages/request-reset/RequestReset';
import SetPassword from '@/pages/set-password/SetPassword';

const Router = (): React.ReactElement => {
  const user = useSelector((state: RootState) => state.user);

  return (
    <Switch>
      <Route exact path={routerPath.HOME}>
        {_.isEmpty(user.access_token) ? (
          <Login />
        ) : (
          <React.Fragment>
            <Navbar />
            <Home />
          </React.Fragment>
        )}
      </Route>
      <Route path={routerPath.ACCOUNT}>
        <Navbar />
        <Account />
      </Route>
      <Route path={routerPath.LOGIN}>
        <Login />
      </Route>
      <Route exact path={routerPath.REQUEST_RESET}>
        <RequestReset />
      </Route>
      <Route path={routerPath.RESET_PASSWORD}>
        <SetPassword />
      </Route>
      <Route path={routerPath.REGISTER}>
        <Register />
      </Route>
      <Route path={routerPath.AUTHENTICATE}>
        <Authenticate />
      </Route>
      <Route path={routerPath.PRIVACY_POLICY}>
        <PrivacyPolicy />
      </Route>
      <Route>
        <PageNotFound />
      </Route>
    </Switch>
  );
};

export default Router;
