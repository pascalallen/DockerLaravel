import React from 'react';
import classnames from 'classnames';

type Props = {
  formName: string;
  name: string;
  type: 'text' | 'password' | 'email' | 'color' | 'date' | 'number' | 'search' | 'tel' | 'file' | 'url';
  className?: string;
  label?: string;
  isValid?: boolean;
  placeholder?: string;
  required?: boolean;
  tabIndex?: number;
  error?: string;
  autoFocus?: boolean;
  disabled?: boolean;
  defaultValue?: string | number | string[];
  multiple?: boolean;
  id?: string;
  handleChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
  handleBlur?: (event: React.FocusEvent<HTMLInputElement>) => void;
};

const Input = (props: Props): React.ReactElement => {
  const {
    formName,
    name,
    type,
    className = '',
    label = '',
    isValid = true,
    placeholder = '',
    required = false,
    tabIndex = 0,
    error = '',
    autoFocus = false,
    disabled = false,
    defaultValue = '',
    multiple = false,
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
      {label ? (
        <label htmlFor={id} className={classnames('form-label', `${id}-label`)}>
          {label}
          {required ? <span className="text-danger">*</span> : null}
        </label>
      ) : null}
      <input
        id={id}
        name={name}
        type={type}
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
