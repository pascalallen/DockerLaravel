const URL_INIT_CSRF = `${process.env.MIX_APP_URL}/sanctum/csrf-cookie`;
const URL_LOGIN = `${process.env.MIX_APP_URL}/login`;
const URL_LOGOUT = `${process.env.MIX_APP_URL}/logout`;
const URL_REGISTER = `${process.env.MIX_APP_URL}/register`;
const URL_RESET_PASSWORD = `${process.env.MIX_APP_URL}/password/reset`;
const URL_REQUEST_RESET = `${process.env.MIX_APP_URL}/password/email`;
const URL_USERS = '/users';
const URL_2FA = '/2fa';

export default Object.freeze({
  URL_INIT_CSRF,
  URL_LOGIN,
  URL_LOGOUT,
  URL_REGISTER,
  URL_RESET_PASSWORD,
  URL_REQUEST_RESET,
  URL_USERS,
  URL_2FA
});
