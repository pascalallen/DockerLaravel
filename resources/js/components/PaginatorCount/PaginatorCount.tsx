import React from 'react';
import classnames from 'classnames';

type Props = {
  recordsCount: number;
  page: number;
  perPage: number;
  totalRecords: number;
  theme?: {
    text?: string;
  };
};

const PaginatorCount = (props: Props): React.ReactElement | null => {
  const { recordsCount, page, perPage, totalRecords, theme } = props;

  const upperRange = (): number => {
    if (page * perPage > totalRecords) {
      return totalRecords;
    }
    return page * perPage;
  };

  const lowerRange = (): number => {
    return page * perPage - perPage + 1;
  };

  return recordsCount > 0 ? (
    <span className={classnames(theme?.text, 'font-size-xs font-weight-bold')}>
      Showing {lowerRange()} to {upperRange()} of {totalRecords}
    </span>
  ) : null;
};

export default PaginatorCount;
