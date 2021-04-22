import _ from 'lodash';
import React, { useEffect, useState } from 'react';
import { Form } from 'react-bootstrap';
import { useHistory } from 'react-router-dom';
import { useToasts } from 'react-toast-notifications';
import { useSelector } from 'react-redux';
import { Helmet } from 'react-helmet-async';
import { RootState } from '@/types/redux';
import { AnyObject } from '@/types/common';
import { routerPath } from '@/router/common';
import auth from '@/api/auth';
import Input from '@/components/Input/Input';

type State = {
  email: string;
  errors: AnyObject;
  isSubmitting: boolean;
};

const initialState: State = {
  email: '',
  errors: {
    email: []
  },
  isSubmitting: false
};

const RequestReset = (): React.ReactElement => {
  const { addToast } = useToasts();
  const history = useHistory();
  const user = useSelector((state: RootState) => state.user);

  const [email, setEmail] = useState(initialState.email);
  const [errors, setErrors] = useState(initialState.errors);
  const [isSubmitting, setIsSubmitting] = useState(initialState.isSubmitting);

  useEffect(() => {
    if (!_.isEmpty(user.access_token)) {
      history.push(routerPath.HOME);
    }
  }, [user]);

  const handleSubmit = async (): Promise<void> => {
    setIsSubmitting(true);
    try {
      const res = await auth.sendResetLinkEmail({ email });
      addToast(res.message, {
        appearance: 'success'
      });
      setIsSubmitting(initialState.isSubmitting);
    } catch (err) {
      setErrors(err.response.data.errors);
      addToast(err.response.data.message, { appearance: 'error' });
      setIsSubmitting(initialState.isSubmitting);
    }
  };

  const formName = 'request-reset';

  return (
    <div className="container">
      <Helmet>
        <title>Request Password Reset | Docker Laravel</title>
      </Helmet>
      <div className="row mt-5">
        <div className="col-md-4 offset-md-4">
          <h4 className="mb-5">Forgot your password?</h4>
          <Form name={formName}>
            <Input
              formName={formName}
              type="email"
              name="email"
              label="Please enter the email address you used to sign up and we’ll send you a password reset link."
              placeholder="Enter email address here"
              autoFocus
              required
              tabIndex={1}
              isValid={_.size(errors?.email) <= 0}
              error={_.get(errors, 'email[0]')}
              handleChange={(event: React.ChangeEvent<HTMLInputElement>): void => setEmail(event.target.value)}
            />
            <button
              className="btn btn-primary"
              type="button"
              tabIndex={2}
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
            <a
              className="btn btn-link"
              href={routerPath.LOGIN}
              onClick={(event): void => {
                event.preventDefault();
                history.push(routerPath.LOGIN);
              }}>
              Cancel
            </a>
          </Form>
        </div>
      </div>
    </div>
  );
};

export default RequestReset;
