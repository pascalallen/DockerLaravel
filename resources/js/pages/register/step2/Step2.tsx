import _ from 'lodash';
import React from 'react';
import { useHistory } from 'react-router-dom';
import Path from '@/router/Path';
import Input from '@/components/Input/Input';

type Props = {
  formName: string;
  errors?: {
    email?: [];
  };
  email: string;
  onSetEmail: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onCancel: () => void;
};

const Step2 = (props: Props): React.ReactElement => {
  const { formName, errors, email, onSetEmail, onCancel } = props;

  const history = useHistory();

  const onNextStep = (): void => {
    history.push(Path.REGISTER_STEP3);
  };

  const disabled = _.size(email) <= 0 || !_.isString(email) || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  return (
    <div className="col-md-4 offset-md-4">
      <h4 className="mb-5">Next question...</h4>
      <Input
        formName={formName}
        type="email"
        name="email"
        label="What is your email?"
        placeholder="Email"
        autoFocus
        required
        tabIndex={1}
        isValid={_.size(errors?.email) <= 0}
        error={_.get(errors, 'email[0]')}
        handleChange={onSetEmail}
      />
      {!disabled && (
        <button className="btn btn-primary float-right" tabIndex={2} disabled={disabled} onClick={onNextStep}>
          Next
        </button>
      )}
      <button className="btn btn-link" tabIndex={3} onClick={onCancel}>
        Cancel
      </button>
    </div>
  );
};

export default Step2;
