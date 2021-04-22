import _ from 'lodash';
import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import { Form } from 'react-bootstrap';
import { useToasts } from 'react-toast-notifications';
import { Helmet } from 'react-helmet-async';
import { AnyObject } from '@/types/common';
import { useMatch, useQuery } from '@/lib/customHooks';
import { routerPath } from '@/router/common';
import auth from '@/api/auth';
import Input from '@/components/Input/Input';

type State = {
  password: string;
  passwordConfirmation: string;
  errors: AnyObject;
  isSubmitting: boolean;
};

const initialState: State = {
  password: '',
  passwordConfirmation: '',
  errors: {
    password: [],
    password_confirmation: []
  },
  isSubmitting: false
};

const SetPassword = (): React.ReactElement => {
  const { addToast } = useToasts();
  const { params } = useMatch();
  const urlQuery = useQuery();
  const history = useHistory();

  const token: string = params.token ?? '';
  const email = urlQuery.get('email') ?? '';

  const [password, setPassword] = useState(initialState.password);
  const [passwordConfirmation, setPasswordConfirmation] = useState(initialState.passwordConfirmation);
  const [errors, setErrors] = useState(initialState.errors);
  const [isSubmitting, setIsSubmitting] = useState(initialState.isSubmitting);

  const handleSubmit = async (): Promise<void> => {
    setIsSubmitting(true);
    try {
      const res = await auth.resetPassword({
        token,
        email,
        password: password,
        password_confirmation: passwordConfirmation
      });
      addToast(res.message, { appearance: 'success' });
      setIsSubmitting(initialState.isSubmitting);
      return history.push(routerPath.LOGIN);
    } catch (err) {
      setErrors(err.response.data.errors);
      addToast(err.response.data.message, { appearance: 'error', autoDismiss: true });
      setIsSubmitting(initialState.isSubmitting);
    }
  };

  const formName = 'set-password';

  return (
    <div className="container">
      <Helmet>
        <title>Reset Password | Docker Laravel</title>
      </Helmet>
      <div className="row mt-5">
        <div className="col-md-4 offset-md-4">
          <h4 className="mb-5">Reset Password</h4>
          <Form name={formName}>
            <Input
              disabled
              formName={formName}
              type="email"
              name="email"
              label="Email"
              defaultValue={email}
              required
              isValid={_.size(errors?.email) <= 0}
              error={_.get(errors, 'email[0]')}
            />
            <Input
              formName={formName}
              type="password"
              name="password"
              label="Password"
              placeholder="Password"
              required
              tabIndex={1}
              isValid={_.size(errors?.password) <= 0}
              error={_.get(errors, 'password[0]')}
              handleChange={(event: React.ChangeEvent<HTMLInputElement>): void => setPassword(event.target.value)}
            />
            <Input
              formName={formName}
              type="password"
              name="password_confirmation"
              label="Confirm Password"
              placeholder="Confirm Password"
              required
              tabIndex={2}
              isValid={_.size(errors?.password_confirmation) <= 0}
              error={_.get(errors, 'password_confirmation[0]')}
              handleChange={(event: React.ChangeEvent<HTMLInputElement>): void =>
                setPasswordConfirmation(event.target.value)
              }
            />
            <button
              className="btn btn-primary"
              type="button"
              tabIndex={3}
              disabled={isSubmitting}
              onClick={handleSubmit}>
              {isSubmitting ? (
                <React.Fragment>
                  <span className="spinner-border spinner-border-sm mr-1" role="status" aria-hidden="true" />
                  Loading...
                </React.Fragment>
              ) : (
                <React.Fragment>Submit</React.Fragment>
              )}
            </button>
          </Form>
        </div>
      </div>
    </div>
  );
};

export default SetPassword;
