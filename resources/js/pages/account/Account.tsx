import _ from 'lodash';
import React, { useEffect, useState } from 'react';
import { Form } from 'react-bootstrap';
import { useToasts } from 'react-toast-notifications';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { RootState } from '@/types/redux';
import { update, logout } from '@/redux/userSlice';
import Path from '@/router/Path';
import google2fa from '@/api/google2fa';
import Input from '@/components/Input/Input';
import Select from '@/components/Select/Select';
import DeleteAccountModal from './DeleteAccountModal/DeleteAccountModal';

type State = {
  password?: string;
  passwordConfirmation?: string;
  qrCode?: string;
  errors?: {
    name?: [];
    password?: [];
    password_confirmation?: [];
  };
  showDeleteAccountModal: boolean;
  isSubmitting: boolean;
};

const initialState: State = {
  showDeleteAccountModal: false,
  isSubmitting: false
};

const Account = (): React.ReactElement => {
  const { addToast } = useToasts();
  const history = useHistory();
  const dispatch = useDispatch();
  const user = useSelector((state: RootState) => state.user);

  const [name, setName] = useState(user.name);
  const [password, setPassword] = useState(initialState.password);
  const [passwordConfirmation, setPasswordConfirmation] = useState(initialState.passwordConfirmation);
  const [twoFactorAuthentication, setTwoFactorAuthentication] = useState(
    !_.isUndefined(user.google2fa_secret) && !_.isNull(user.google2fa_secret)
  );
  const [google2faSecret, setGoogle2faSecret] = useState(user.google2fa_secret);
  const [qrCode, setQRCode] = useState(initialState.qrCode);
  const [errors, setErrors] = useState(initialState.errors);
  const [showDeleteAccountModal, setShowDeleteAccountModal] = useState(initialState.showDeleteAccountModal);
  const [isSubmitting, setIsSubmitting] = useState(initialState.isSubmitting);

  useEffect(() => {
    if (_.isEmpty(user.access_token)) {
      history.push(Path.LOGIN);
    }
  }, [user]);

  useEffect(() => {
    if (twoFactorAuthentication) {
      const fetchQRCode = async (): Promise<void> => {
        try {
          const res = await google2fa.getQRCode();
          setQRCode(res.qr_code);
          setGoogle2faSecret(res.google2fa_secret);
        } catch (error: any) {
          if (error.response.status === 401 && error.response.statusText === 'Unauthorized') {
            await dispatch(logout());
          }
          addToast(error.response.data.message, { appearance: 'error' });
        }
      };

      fetchQRCode();
    }
  }, [twoFactorAuthentication]);

  const handleSelect = (event: React.ChangeEvent<HTMLSelectElement>): void => {
    if (event.target.value === 'true') {
      setTwoFactorAuthentication(true);
    }
    if (event.target.value === 'false') {
      setTwoFactorAuthentication(false);
      setGoogle2faSecret(undefined);
      setQRCode(initialState.qrCode);
    }
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>): Promise<void> => {
    event.preventDefault();

    if (_.isUndefined(name) || _.isUndefined(user.id)) {
      return;
    }

    setIsSubmitting(true);
    try {
      await dispatch(
        update(
          {
            name,
            password,
            password_confirmation: passwordConfirmation,
            google2fa_secret: google2faSecret
          },
          user.id
        )
      );
      addToast('Account updated successfully!', { appearance: 'success', autoDismiss: true });
      setIsSubmitting(initialState.isSubmitting);
    } catch (error: any) {
      if (error.response.status === 401 && error.response.statusText === 'Unauthorized') {
        await dispatch(logout());
      }
      setErrors(error.response.data.errors);
      addToast(error.response.data.message, { appearance: 'error' });
      setIsSubmitting(initialState.isSubmitting);
    }
  };

  const formName = 'account';

  return (
    <div className="container">
      <Helmet>
        <title>Account | Docker Laravel</title>
      </Helmet>
      {showDeleteAccountModal && (
        <DeleteAccountModal
          show={showDeleteAccountModal}
          onClose={(): void => {
            setShowDeleteAccountModal(initialState.showDeleteAccountModal);
          }}
        />
      )}
      <div className="row my-5">
        <div className="col-md-6">
          <h4 className="mb-5">Account</h4>
          <Form
            onSubmit={(event: React.FormEvent<HTMLFormElement>): Promise<void> => handleSubmit(event)}
            name={formName}>
            <Input disabled formName={formName} type="email" name="email" label="Email" defaultValue={user.email} />
            <input disabled form={formName} type="hidden" name="google2fa_secret" defaultValue={google2faSecret} />
            <Input
              required
              formName={formName}
              type="text"
              name="name"
              label="Name"
              defaultValue={name}
              tabIndex={1}
              isValid={_.size(errors?.name) <= 0}
              error={_.get(errors, 'name[0]')}
              handleChange={(event: React.ChangeEvent<HTMLInputElement>): void => setName(event.target.value)}
            />
            <Input
              formName={formName}
              type="password"
              name="password"
              label="Change Password"
              placeholder="Password"
              tabIndex={2}
              isValid={_.size(errors?.password) <= 0}
              error={_.get(errors, 'password[0]')}
              handleChange={(event: React.ChangeEvent<HTMLInputElement>): void => setPassword(event.target.value)}
            />
            <Input
              formName={formName}
              type="password"
              name="password_confirmation"
              label="Confirm Password"
              placeholder="Password"
              tabIndex={3}
              isValid={_.size(errors?.password_confirmation) <= 0}
              error={_.get(errors, 'password_confirmation[0]')}
              handleChange={(event: React.ChangeEvent<HTMLInputElement>): void =>
                setPasswordConfirmation(event.target.value)
              }
            />
            <Select
              required
              className="col-md-6 px-0"
              formName={formName}
              name="two_factor_authentication"
              label="Two Factor Authentication?"
              tabIndex={4}
              defaultValue={twoFactorAuthentication ? 'true' : 'false'}
              handleChange={handleSelect}>
              <option value="true">Definitely turn on!</option>
              <option value="false">Leave it off.</option>
            </Select>
            {twoFactorAuthentication && qrCode && google2faSecret && (
              <React.Fragment>
                <div className="form-group">
                  <div className="form-label">
                    Scan the QR image below with your authenticator app to enable two factor authentication.
                    Alternatively, you may manually add the code below with your authenticator app. Remember to click
                    Submit for account changes to take effect.
                  </div>
                </div>
                <div className="form-group col-md-6 px-0">
                  <label htmlFor="qr-image" className="form-label qr-image-label">
                    Code: {google2faSecret}
                  </label>
                  <span dangerouslySetInnerHTML={{ __html: qrCode }} />
                </div>
              </React.Fragment>
            )}
            <div className="mt-5">
              <button className="btn btn-primary" type="submit" tabIndex={5} disabled={isSubmitting}>
                {isSubmitting ? (
                  <React.Fragment>
                    <span className="spinner-border spinner-border-sm mr-1" role="status" aria-hidden="true" />
                    Submitting...
                  </React.Fragment>
                ) : (
                  <React.Fragment>Submit</React.Fragment>
                )}
              </button>
              <a
                className="btn text-danger"
                type="button"
                tabIndex={6}
                onClick={(): void => setShowDeleteAccountModal(true)}>
                Delete Account
              </a>
            </div>
          </Form>
        </div>
      </div>
    </div>
  );
};

export default Account;
