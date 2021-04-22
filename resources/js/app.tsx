/**
 * First we will load all of this project's JavaScript dependencies which
 * includes React and other helpers. It's a great starting point while
 * building robust, powerful web applications using React + Laravel.
 */

require('./bootstrap');

/**
 * Next, we will create a fresh React component instance and attach it to
 * the page. Then, you may begin adding components to this application
 * or customize the JavaScript scaffolding to fit your unique needs.
 */

import '../sass/app.scss';
import 'promise-polyfill/src/polyfill';
import 'whatwg-fetch';
import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { ToastProvider } from 'react-toast-notifications';
import { Helmet, HelmetProvider } from 'react-helmet-async';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import store from '@/redux/store';
import storePersist from '@/redux/storePersist';
import Router from '@/router/Router';

store.subscribe(() => {
  storePersist.saveState(store.getState());
});

const stripePromise = loadStripe(`${process.env.MIX_STRIPE_KEY}`);

const App = (): React.ReactElement => {
  return (
    <React.StrictMode>
      <Provider store={store}>
        <HelmetProvider>
          <Helmet>
            <meta name="robots" content="noindex, nofollow" />
          </Helmet>
          <Elements stripe={stripePromise}>
            <ToastProvider>
              <BrowserRouter>
                <Router />
              </BrowserRouter>
            </ToastProvider>
          </Elements>
        </HelmetProvider>
      </Provider>
    </React.StrictMode>
  );
};

ReactDOM.render(<App />, document.getElementById('app'));
