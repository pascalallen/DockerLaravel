import _ from 'lodash';
import { AnyObject, StateDropdownObject } from '@/types/common';

export const removeEmptyQueryParams = (obj: AnyObject, ...customValues: (string | number)[]): AnyObject => {
  // removes from the queryParams object any empty value so that is not added to the queryString
  _.forEach(obj, (value, key) => {
    if (
      _.isNil(value) ||
      _.isUndefined(value) ||
      _.isNaN(value) ||
      _.isFunction(value) ||
      _.isObject(value) ||
      value === ''
    ) {
      delete obj[key];
    }

    _.forEach(customValues, cv => {
      if (value === cv) {
        delete obj[key];
      }
    });
  });

  return obj;
};

export const queryStringify = (params: { [key: string]: number | string | string[] | undefined }): string => {
  const query = _.chain(params)
    .keys()
    .map(key => {
      const value = params[key];
      if (_.isArray(value)) {
        return `${key}[]=${_.join(value, `&${key}[]=`)}`;
      }
      return `${key}=${value}`;
    })
    .join('&')
    .value();

  return query ? `?${query}` : '';
};

export const getStatesForSelectDropdown = (): StateDropdownObject[] => {
  return [
    { value: 'AL', displayValue: 'Alabama' },
    { value: 'AK', displayValue: 'Alaska' },
    { value: 'AZ', displayValue: 'Arizona' },
    { value: 'AR', displayValue: 'Arkansas' },
    { value: 'CA', displayValue: 'California' },
    { value: 'CO', displayValue: 'Colorado' },
    { value: 'CT', displayValue: 'Connecticut' },
    { value: 'DE', displayValue: 'Delaware' },
    { value: 'DC', displayValue: 'District Of Columbia' },
    { value: 'FL', displayValue: 'Florida' },
    { value: 'GA', displayValue: 'Georgia' },
    { value: 'HI', displayValue: 'Hawaii' },
    { value: 'ID', displayValue: 'Idaho' },
    { value: 'IL', displayValue: 'Illinois' },
    { value: 'IN', displayValue: 'Indiana' },
    { value: 'IA', displayValue: 'Iowa' },
    { value: 'KS', displayValue: 'Kansas' },
    { value: 'KY', displayValue: 'Kentucky' },
    { value: 'LA', displayValue: 'Louisiana' },
    { value: 'ME', displayValue: 'Maine' },
    { value: 'MD', displayValue: 'Maryland' },
    { value: 'MA', displayValue: 'Massachusetts' },
    { value: 'MI', displayValue: 'Michigan' },
    { value: 'MN', displayValue: 'Minnesota' },
    { value: 'MS', displayValue: 'Mississippi' },
    { value: 'MO', displayValue: 'Missouri' },
    { value: 'MT', displayValue: 'Montana' },
    { value: 'NE', displayValue: 'Nebraska' },
    { value: 'NV', displayValue: 'Nevada' },
    { value: 'NH', displayValue: 'New Hampshire' },
    { value: 'NJ', displayValue: 'New Jersey' },
    { value: 'NM', displayValue: 'New Mexico' },
    { value: 'NY', displayValue: 'New York' },
    { value: 'NC', displayValue: 'North Carolina' },
    { value: 'ND', displayValue: 'North Dakota' },
    { value: 'OH', displayValue: 'Ohio' },
    { value: 'OK', displayValue: 'Oklahoma' },
    { value: 'OR', displayValue: 'Oregon' },
    { value: 'PA', displayValue: 'Pennsylvania' },
    { value: 'RI', displayValue: 'Rhode Island' },
    { value: 'SC', displayValue: 'South Carolina' },
    { value: 'SD', displayValue: 'South Dakota' },
    { value: 'TN', displayValue: 'Tennessee' },
    { value: 'TX', displayValue: 'Texas' },
    { value: 'UT', displayValue: 'Utah' },
    { value: 'VT', displayValue: 'Vermont' },
    { value: 'VA', displayValue: 'Virginia' },
    { value: 'WA', displayValue: 'Washington' },
    { value: 'WV', displayValue: 'West Virginia' },
    { value: 'WI', displayValue: 'Wisconsin' },
    { value: 'WY', displayValue: 'Wyoming' }
  ];
};
