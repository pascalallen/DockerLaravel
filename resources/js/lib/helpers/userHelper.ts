/**
 * Not used, needs to be refactored and tested
 */
import _ from 'lodash';
import store from '@/redux/store';

const hasPermissions = (permissions: string[]): boolean => {
  const state = store.getState();
  return _.every(permissions, permission => _.get(state, `user.permissions.${permission}`) === permission);
};

const hasRole = (role: string): boolean => {
  const state = store.getState();
  return _.get(state, `user.roles.${role}`) === role;
};

export default Object.freeze({
  hasPermissions,
  hasRole
});
