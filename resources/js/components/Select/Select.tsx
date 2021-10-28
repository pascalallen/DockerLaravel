import React from 'react';
import classnames from 'classnames';

type Props = {
  formName: string;
  name: string;
  children: React.ReactNode;
  value?: string | string[] | number;
  className?: string;
  placeholder?: string;
  label?: string;
  isValid?: boolean;
  required?: boolean;
  tabIndex?: number;
  disabled?: boolean;
  error?: string;
  defaultValue?: string | number | string[];
  id?: string;
  handleChange?: (event: React.ChangeEvent<HTMLSelectElement>) => void;
  handleBlur?: (event: React.FocusEvent<HTMLSelectElement>) => void;
};

const Select = (props: Props): React.ReactElement => {
  const {
    formName,
    name,
    children,
    value = undefined,
    className = '',
    placeholder = '',
    label = '',
    isValid = true,
    required = false,
    tabIndex = 0,
    disabled = false,
    error = '',
    defaultValue = '',
    id = `${formName}-${name.replace('_', '-')}`,
    handleChange = (event: React.ChangeEvent<HTMLSelectElement>): void => {
      event.preventDefault();
    },
    handleBlur = (event: React.FocusEvent<HTMLSelectElement>): void => {
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
      <select
        id={id}
        name={name}
        className={classnames('form-control', !isValid ? 'is-invalid' : '', `${id}-select`)}
        placeholder={placeholder}
        onChange={handleChange}
        onBlur={handleBlur}
        required={required}
        tabIndex={tabIndex}
        disabled={disabled}
        defaultValue={defaultValue}
        value={value}>
        {children}
      </select>
      {error ? (
        <div id={`${id}-error`} className={classnames('invalid-feedback', `${id}-error`)}>
          {error}
        </div>
      ) : null}
    </div>
  );
};

export default Select;
