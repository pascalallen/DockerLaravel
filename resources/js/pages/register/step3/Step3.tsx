import _ from 'lodash';
import React from 'react';
import Input from '@/components/Input/Input';

type Props = {
  isSubmitting: boolean;
  formName: string;
  errors?: {
    password?: [];
  };
  password: string;
  onSetPassword: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onCancel: () => void;
};

const Step3 = (props: Props): React.ReactElement => {
  const { isSubmitting, formName, errors, password, onSetPassword, onCancel } = props;

  const disabled = _.size(password) < 8 || _.size(password) >= 255;

  return (
    <div className="col-md-4 offset-md-4">
      <h4 className="mb-5">Almost done...</h4>
      <Input
        formName={formName}
        type="password"
        name="password"
        label="Set your password."
        placeholder="Password"
        autoFocus
        required
        tabIndex={1}
        isValid={_.size(errors?.password) <= 0}
        error={_.get(errors, 'password[0]')}
        handleChange={onSetPassword}
      />
      {!disabled && (
        <button className="btn btn-primary float-right" type="submit" tabIndex={2} disabled={disabled || isSubmitting}>
          {isSubmitting ? (
            <React.Fragment>
              <span className="spinner-border spinner-border-sm mr-1" role="status" aria-hidden="true" />
              Loading...
            </React.Fragment>
          ) : (
            <React.Fragment>Finish</React.Fragment>
          )}
        </button>
      )}
      <button className="btn btn-link" tabIndex={3} onClick={onCancel}>
        Cancel
      </button>
    </div>
  );
};

export default Step3;
