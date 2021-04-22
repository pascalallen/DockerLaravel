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
  handleChange?: (event: React.ChangeEvent<HTMLSelectElement>) => void;
  handleBlur?: (event: React.FocusEvent<HTMLSelectElement>) => void;
};

const Select = (props: Props): React.ReactElement => {
  const {
    formName,
    name,
    children,
    // Optional props
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
    handleChange = (event: React.ChangeEvent<HTMLSelectElement>): void => {
      event.preventDefault();
    },
    handleBlur = (event: React.FocusEvent<HTMLSelectElement>): void => {
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
      <select
        id={id}
        name={name}
        className={classnames(isValid ? 'form-control' : 'form-control is-invalid', `${id}-input`)}
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
