import _ from 'lodash';
import React from 'react';
import { useHistory } from 'react-router-dom';
import Path from '@/router/Path';
import Input from '@/components/Input/Input';

type Props = {
  formName: string;
  errors?: {
    name?: [];
  };
  name: string;
  onSetName: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onCancel: () => void;
};

const Step1 = (props: Props): React.ReactElement => {
  const { formName, errors, name, onSetName, onCancel } = props;

  const history = useHistory();

  const onNextStep = (): void => {
    history.push(Path.REGISTER_STEP2);
  };

  const disabled = _.size(name) <= 0;

  return (
    <div className="col-md-4 offset-md-4">
      <h4 className="mb-5">Lets get you signed up...</h4>
      <Input
        formName={formName}
        type="text"
        name="name"
        label="What is your name?"
        placeholder="Name"
        autoFocus
        required
        tabIndex={1}
        isValid={_.size(errors?.name) <= 0}
        error={_.get(errors, 'name[0]')}
        handleChange={onSetName}
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

export default Step1;
