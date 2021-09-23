import React from 'react';
import classnames from 'classnames';

type Props = {
  formName: string;
  name: string;
  className?: string;
  checked?: boolean;
  label?: string;
  inline?: boolean;
  isValid?: boolean;
  required?: boolean;
  tabIndex?: number;
  disabled?: boolean;
  error?: string;
  id?: string;
  handleChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
  handleBlur?: (event: React.FocusEvent<HTMLInputElement>) => void;
};

const Checkbox = (props: Props): React.ReactElement => {
  const {
    formName,
    name,
    className = '',
    checked = false,
    label = '',
    inline = true,
    isValid = true,
    required = false,
    tabIndex = 0,
    disabled = false,
    error = '',
    id = `${formName}-${name.replace('_', '-')}`,
    handleChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
      event.preventDefault();
    },
    handleBlur = (event: React.FocusEvent<HTMLInputElement>): void => {
      event.preventDefault();
    }
  } = props;

  return (
    <div className={classnames('form-group', className)}>
      <div className={classnames('form-check', inline ? 'form-check-inline' : '')}>
        <input
          id={id}
          type="checkbox"
          name={name}
          checked={checked}
          className={classnames('form-check-input', !isValid ? 'is-invalid' : '', `${id}-checkbox`)}
          onChange={handleChange}
          onBlur={handleBlur}
          required={required}
          tabIndex={tabIndex}
          disabled={disabled}
        />
        {label ? (
          <label htmlFor={id} className={classnames('form-check-label', `${id}-label`)}>
            {label}
          </label>
        ) : null}
        {error ? (
          <div id={`${id}-error`} className={classnames('invalid-feedback', `${id}-error`)}>
            {error}
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default Checkbox;
