import apiRequest from '@/api/apiRequest';
import apiUrl from '@/constants/apiUrl';
import httpMethod from '@/constants/httpMethod';
import { State as UserState } from '@/redux/userSlice';

const login = async (params: { email: string; password: string }): Promise<null> => {
  return apiRequest.send({
    method: httpMethod.POST,
    uri: apiUrl.URL_LOGIN,
    body: params,
    options: { headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' } }
  });
};

const sendResetLinkEmail = async (params: { email: string }): Promise<{ message: string }> => {
  return apiRequest.send({ method: httpMethod.POST, uri: apiUrl.URL_REQUEST_RESET, body: params });
};

const register = async (params: { name: string; email: string; password: string }): Promise<null> => {
  return apiRequest.send({
    method: httpMethod.POST,
    uri: apiUrl.URL_REGISTER,
    body: params,
    options: { headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' } }
  });
};

const logout = async (): Promise<null> => {
  return apiRequest.send({
    method: httpMethod.POST,
    uri: apiUrl.URL_LOGOUT,
    options: { headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' } }
  });
};

const initializeCsrfProtection = async (): Promise<null> => {
  return apiRequest.send({ method: httpMethod.GET, uri: apiUrl.URL_INIT_CSRF });
};

const resetPassword = async (params: {
  token: string;
  email: string;
  password: string;
  password_confirmation: string;
}): Promise<{ message: string }> => {
  return apiRequest.send({
    method: httpMethod.POST,
    uri: apiUrl.URL_RESET_PASSWORD,
    body: params,
    options: { headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' } }
  });
};

const multifactorAuthentication = async (params: { one_time_password: string }): Promise<UserState> => {
  return apiRequest.send({
    method: httpMethod.POST,
    uri: apiUrl.URL_2FA,
    body: params,
    options: { auth: true }
  });
};

const hasTwoFactorAuthentication = async (params: {
  email: string;
}): Promise<{ has_two_factor_authentication: boolean }> => {
  return apiRequest.send({
    method: httpMethod.POST,
    uri: `${apiUrl.URL_2FA}/check`,
    body: params,
    options: { auth: true }
  });
};

export default Object.freeze({
  login,
  sendResetLinkEmail,
  register,
  logout,
  initializeCsrfProtection,
  resetPassword,
  multifactorAuthentication,
  hasTwoFactorAuthentication
});
