import _ from 'lodash';
import React, { useEffect, useState } from 'react';
import { Form } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { useToasts } from 'react-toast-notifications';
import { Helmet } from 'react-helmet-async';
import { AnyObject } from '@/types/common';
import { RootState } from '@/types/redux';
import { routerPath } from '@/router/common';
import { authenticate } from '@/redux/userSlice';
import Input from '@/components/Input/Input';

type State = {
  oneTimePassword: string;
  errors: AnyObject;
  isSubmitting: boolean;
};

const initialState: State = {
  oneTimePassword: '',
  errors: {
    one_time_password: []
  },
  isSubmitting: false
};

const Authenticate = (): React.ReactElement => {
  const { addToast } = useToasts();
  const dispatch = useDispatch();
  const history = useHistory();
  const user = useSelector((state: RootState) => state.user);

  const [oneTimePassword, setOneTimePassword] = useState(initialState.oneTimePassword);
  const [errors, setErrors] = useState(initialState.errors);
  const [isSubmitting, setIsSubmitting] = useState(initialState.isSubmitting);

  const handleSubmit = async (): Promise<void> => {
    setIsSubmitting(true);
    try {
      await dispatch(authenticate({ one_time_password: oneTimePassword }));
      setIsSubmitting(initialState.isSubmitting);
    } catch (err) {
      setErrors(err.response.data.errors);
      addToast(err.response.data.message, { appearance: 'error' });
      setIsSubmitting(initialState.isSubmitting);
      history.push(routerPath.LOGIN);
    }
  };

  useEffect(() => {
    if (!_.isEmpty(user.access_token)) {
      setIsSubmitting(initialState.isSubmitting);
      history.push(routerPath.HOME);
    }
  }, [user]);

  const formName = 'multi-factor-authentication';

  return (
    <div className="container">
      <Helmet>
        <title>Authenticate | Chart7</title>
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>
      <div className="row mt-5 justify-content-center">
        <div className="col-md-4 p-5 bg-gray-100">
          <h4 className="mb-3">Authenticate</h4>
          <Form name={formName}>
            <Input
              formName={formName}
              type="number"
              name="one_time_password"
              label="One Time Password"
              placeholder="One Time Password"
              required
              tabIndex={1}
              isValid={_.size(errors?.one_time_password) <= 0}
              error={_.get(errors, 'one_time_password[0]')}
              handleChange={(event: React.ChangeEvent<HTMLInputElement>): void =>
                setOneTimePassword(event.target.value)
              }
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
          </Form>
        </div>
      </div>
    </div>
  );
};

export default Authenticate;
