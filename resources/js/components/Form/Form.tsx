import React, { ReactNode } from 'react';
import classnames from 'classnames';

type Props = {
  id?: string;
  name: string;
  className?: string;
  children?: ReactNode | null;
  autoComplete?: boolean;
  noValidate?: boolean;
  handleSubmit?: (event: React.FormEvent<HTMLFormElement>) => void;
};

const Form = (props: Props): React.ReactElement => {
  const {
    id,
    name,
    className = '',
    children = [],
    autoComplete = false,
    noValidate = false,
    handleSubmit = (event: React.FormEvent<HTMLFormElement>): void => {
      event.preventDefault();
    }
  } = props;

  const htmlId = id ?? `${name.replace('_', '-')}-form`;

  return (
    <form
      id={htmlId}
      className={classnames(htmlId, className)}
      autoComplete={autoComplete ? 'on' : 'off'}
      onSubmit={handleSubmit}
      noValidate={noValidate}>
      {children}
    </form>
  );
};

export default Form;
