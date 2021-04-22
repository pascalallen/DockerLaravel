import _ from 'lodash';
import React, { useEffect, useState } from 'react';
import { Form } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { Switch, Route, useHistory } from 'react-router-dom';
import { useToasts } from 'react-toast-notifications';
import { Helmet } from 'react-helmet-async';
import { RootState } from '@/types/redux';
import { register } from '@/redux/userSlice';
import { routerPath } from '@/router/common';
import Step1 from './step1/Step1';
import Step2 from './step2/Step2';
import Step3 from './step3/Step3';
import PageNotFound from '@/components/PageNotFound/PageNotFound';

type State = {
  name: string;
  email: string;
  password: string;
  errors?: {
    name?: [];
    email?: [];
    password?: [];
  };
  isSubmitting: boolean;
};

const initialState: State = {
  name: '',
  email: '',
  password: '',
  isSubmitting: false
};

const Register = (): React.ReactElement => {
  const { addToast } = useToasts();
  const dispatch = useDispatch();
  const history = useHistory();
  const user = useSelector((state: RootState) => state.user);

  const [name, setName] = useState(initialState.name);
  const [email, setEmail] = useState(initialState.email);
  const [password, setPassword] = useState(initialState.password);
  const [errors, setErrors] = useState(initialState.errors);
  const [isSubmitting, setIsSubmitting] = useState(initialState.isSubmitting);

  useEffect(() => {
    if (!_.isEmpty(user.access_token)) {
      history.push(routerPath.HOME);
    }
  }, [user, name, email, password]);

  const resetForm = (): void => {
    setName(initialState.name);
    setEmail(initialState.email);
    setPassword(initialState.password);
    setErrors(initialState.errors);
    setIsSubmitting(initialState.isSubmitting);
    localStorage.removeItem('name');
    localStorage.removeItem('email');
    localStorage.removeItem('password');
  };

  const handleRegister = async (event: React.FormEvent<HTMLFormElement>): Promise<void> => {
    event.preventDefault();
    setIsSubmitting(true);

    const storedName = localStorage.getItem('name');
    const storedEmail = localStorage.getItem('email');
    const storedPassword = localStorage.getItem('password');

    if (!storedName || !storedEmail || !storedPassword) {
      addToast('Problem fetching registration data from local storage.', { appearance: 'error' });
      return resetForm();
    }

    try {
      await dispatch(
        register({
          name: storedName,
          email: storedEmail,
          password: storedPassword
        })
      );
      addToast('Registration successful!', {
        appearance: 'success'
      });
      setIsSubmitting(initialState.isSubmitting);
    } catch (err) {
      setErrors(err.response.data.errors);
      addToast(err.response.data.message, { appearance: 'error' });
      resetForm();
    }
  };

  const handleSetName = (event: React.ChangeEvent<HTMLInputElement>): void => {
    event.persist();
    setName(event.target.value);
    localStorage.setItem('name', event.target.value);
  };

  const handleSetEmail = (event: React.ChangeEvent<HTMLInputElement>): void => {
    event.persist();
    setEmail(event.target.value);
    localStorage.setItem('email', event.target.value);
  };

  const handleSetPassword = (event: React.ChangeEvent<HTMLInputElement>): void => {
    event.persist();
    setPassword(event.target.value);
    localStorage.setItem('password', event.target.value);
  };

  const handleCancel = (): void => {
    resetForm();
    return history.push(routerPath.LOGIN);
  };

  const formName = 'register';

  const renderRoutes = (): React.ReactElement => {
    return (
      <Switch>
        <Route exact path={routerPath.REGISTER}>
          <Step1 formName={formName} errors={errors} name={name} onSetName={handleSetName} onCancel={handleCancel} />
        </Route>
        <Route path={routerPath.REGISTER_STEP2}>
          <Step2
            formName={formName}
            errors={errors}
            email={email}
            onSetEmail={handleSetEmail}
            onCancel={handleCancel}
          />
        </Route>
        <Route path={routerPath.REGISTER_STEP3}>
          <Step3
            isSubmitting={isSubmitting}
            formName={formName}
            errors={errors}
            password={password}
            onSetPassword={handleSetPassword}
            onCancel={handleCancel}
          />
        </Route>
        <Route>
          <PageNotFound />
        </Route>
      </Switch>
    );
  };

  return (
    <div className="container">
      <Helmet>
        <title>Register | Docker Laravel</title>
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>
      <Form
        onSubmit={(event: React.FormEvent<HTMLFormElement>): Promise<void> => handleRegister(event)}
        name={formName}>
        <div className="row mt-5">{renderRoutes()}</div>
      </Form>
    </div>
  );
};

export default Register;
