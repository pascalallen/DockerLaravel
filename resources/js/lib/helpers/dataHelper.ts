import _ from 'lodash';

const listToMap = (array: string[]): { [key: string]: string } => {
  const hash: { [key: string]: string } = {};

  _.each(array, item => {
    hash[item] = item;
  });

  return hash;
};

type QueryParamsObject = {
  [key: string]:
    | number
    | boolean
    | string
    | string[]
    | { [key: string]: number | boolean | string | string[] | undefined | null }
    | undefined
    | null;
};

const removeEmptyKeys = (params: QueryParamsObject): QueryParamsObject => {
  _.forEach(params, (value, key) => {
    if (
      _.isNil(value) ||
      _.isUndefined(value) ||
      _.isNaN(value) ||
      (_.isArray(value) && _.isEmpty(value)) ||
      value === ''
    ) {
      delete params[key];
    }
    if (_.isObject(value)) {
      _.forEach(params, (value, key) => {
        if (
          _.isNil(value) ||
          _.isUndefined(value) ||
          _.isNaN(value) ||
          (_.isArray(value) && _.isEmpty(value)) ||
          value === ''
        ) {
          delete params[key];
        }
      });
    }
  });

  return params;
};

const queryStringify = (params: QueryParamsObject): string => {
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

const convertDateServerToClient = (date: string): string => {
  const year = date.substr(0, 4);
  const month = parseInt(date.substr(5, 2)).toString();
  const day = parseInt(date.substr(8, 2)).toString();

  return month + '/' + day + '/' + year;
};

const convertDateClientToServer = (date: string): string => {
  const parts = date.split('/', 3);
  const year = parts[2];
  let month = parts[0];
  month = month.length > 1 ? month : '0' + month;
  let day = parts[1];
  day = day.length > 1 ? day : '0' + day;

  return year + '-' + month + '-' + day;
};

export default Object.freeze({
  listToMap,
  queryStringify,
  removeEmptyKeys,
  convertDateServerToClient,
  convertDateClientToServer
});
