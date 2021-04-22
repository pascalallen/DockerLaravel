import React from 'react';
import classnames from 'classnames';

type Props = {
  formName: string;
  type: 'text' | 'password' | 'email' | 'color' | 'date' | 'number' | 'search' | 'tel' | 'file' | 'url';
  name: string;
  className?: string;
  placeholder?: string;
  label?: string;
  isValid?: boolean;
  autoFocus?: boolean;
  required?: boolean;
  tabIndex?: number;
  disabled?: boolean;
  error?: string;
  defaultValue?: string | number | string[];
  multiple?: boolean;
  handleChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
  handleBlur?: (event: React.FocusEvent<HTMLInputElement>) => void;
};

const Input = (props: Props): React.ReactElement => {
  const {
    formName,
    type,
    name,
    // Optional props
    className = '',
    placeholder = '',
    label = '',
    isValid = true,
    autoFocus = false,
    required = false,
    tabIndex = 0,
    disabled = false,
    error = '',
    defaultValue = '',
    multiple = false,
    handleChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
      event.preventDefault();
    },
    handleBlur = (event: React.FocusEvent<HTMLInputElement>): void => {
      event.preventDefault();
    }
  } = props;

  const id = `${formName}-${name.replace('_', '-')}`;

  return (
    <div className={classnames('form-group', className)}>
      {label ? (
        <label htmlFor={id} className={classnames('form-label', `${id}-label`)}>
          {label}
        </label>
      ) : null}
      <input
        id={id}
        type={type}
        name={name}
        className={classnames(
          type === 'file' ? 'form-control-file' : 'form-control',
          isValid ? '' : 'is-invalid',
          `${id}-input`
        )}
        placeholder={placeholder}
        onChange={handleChange}
        onBlur={handleBlur}
        autoFocus={autoFocus}
        required={required}
        tabIndex={tabIndex}
        disabled={disabled}
        defaultValue={defaultValue}
        multiple={multiple}
      />
      {error ? (
        <div id={`${id}-error`} className={classnames('invalid-feedback', `${id}-error`)}>
          {error}
        </div>
      ) : null}
    </div>
  );
};

export default Input;
