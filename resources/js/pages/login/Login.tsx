import _ from 'lodash';
import React, { useEffect, useState } from 'react';
import { Form } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { useToasts } from 'react-toast-notifications';
import { Helmet } from 'react-helmet-async';
import { RootState } from '@/types/redux';
import { AnyObject } from '@/types/common';
import { login } from '@/redux/userSlice';
import Path from '@/router/Path';
import auth from '@/api/auth';
import Input from '@/components/Input/Input';

type State = {
  email: string;
  password: string;
  errors: AnyObject;
  isSubmitting: boolean;
};

const initialState: State = {
  email: '',
  password: '',
  errors: {
    email: [],
    password: []
  },
  isSubmitting: false
};

const Login = (): React.ReactElement => {
  const { addToast } = useToasts();
  const dispatch = useDispatch();
  const history = useHistory();
  const user = useSelector((state: RootState) => state.user);

  const [email, setEmail] = useState(initialState.email);
  const [password, setPassword] = useState(initialState.password);
  const [errors, setErrors] = useState(initialState.errors);
  const [isSubmitting, setIsSubmitting] = useState(initialState.isSubmitting);

  const formName = 'login';

  useEffect(() => {
    if (!_.isEmpty(user.access_token)) {
      history.push(Path.HOME);
    }
  }, [user]);

  const handleLogin = async (): Promise<void> => {
    setIsSubmitting(true);
    try {
      const res = await auth.hasTwoFactorAuthentication({ email });
      if (res.has_two_factor_authentication) {
        await auth.initializeCsrfProtection().then(async () => {
          await auth.login({ email, password });
        });
        history.push(Path.AUTHENTICATE);
      } else {
        await dispatch(login({ email, password }));
      }
      setIsSubmitting(initialState.isSubmitting);
    } catch (err: any) {
      setErrors(err.response.data.errors);
      addToast(err.response.data.message, { appearance: 'error' });
      setIsSubmitting(initialState.isSubmitting);
    }
  };

  return (
    <div className="container">
      <Helmet>
        <title>Login | Docker Laravel</title>
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>
      <div className="row mt-5 mb-4">
        <div className="col-md-6 offset-md-3 text-center">Logo img here</div>
      </div>
      <div className="row justify-content-center">
        <div className="col-md-4 p-5 bg-gray-100">
          <h4 className="mb-3">Login</h4>
          <Form name={formName}>
            <Input
              formName={formName}
              type="email"
              name="email"
              placeholder="Enter email address here"
              autoFocus
              required
              tabIndex={1}
              isValid={_.size(errors?.email) <= 0}
              error={_.get(errors, 'email[0]')}
              handleChange={(event: React.ChangeEvent<HTMLInputElement>): void => setEmail(event.target.value)}
            />
            <Input
              formName={formName}
              type="password"
              name="password"
              placeholder="Password here"
              required
              tabIndex={2}
              isValid={_.size(errors?.password) <= 0}
              error={_.get(errors, 'password[0]')}
              handleChange={(event: React.ChangeEvent<HTMLInputElement>): void => setPassword(event.target.value)}
            />
            <button
              className="btn btn-primary"
              type="button"
              tabIndex={3}
              disabled={isSubmitting}
              onClick={handleLogin}>
              {isSubmitting ? (
                <React.Fragment>
                  <span className="spinner-border spinner-border-sm mr-1" role="status" aria-hidden="true" />
                  Loading...
                </React.Fragment>
              ) : (
                <React.Fragment>Sign In</React.Fragment>
              )}
            </button>
            <a
              className="btn btn-link float-right"
              href={Path.REQUEST_RESET}
              onClick={(event): void => {
                event.preventDefault();
                history.push(Path.REQUEST_RESET);
              }}
              role="button"
              tabIndex={4}>
              Forgot Password?
            </a>
          </Form>
        </div>
        <div className="col-md-4 p-5 bg-primary">
          <h4 className="text-center">Sign up today!</h4>
          <p>
            Lorem ipsum dolor sit amet, consectetur adipisicing elit. A, adipisci, amet aspernatur autem dolorum eos eum
            fugiat hic libero nesciunt nulla officiis recusandae sed sunt suscipit, vel veritatis voluptates voluptatum.
          </p>
          <div className="text-center mt-5">
            <a
              className="btn btn-secondary"
              href={Path.REGISTER}
              onClick={(event): void => {
                event.preventDefault();
                history.push(Path.REGISTER);
              }}
              role="button"
              tabIndex={4}>
              Sign Up!
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
