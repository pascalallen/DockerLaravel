enum Path {
  HOME = '/',
  ACCOUNT = '/account',
  FORBIDDEN = '/forbidden',
  LOGIN = '/login',
  PRIVACY_POLICY = '/privacy-policy',
  REQUEST_RESET = '/password/reset',
  RESET_PASSWORD = '/password/reset/:token',
  REGISTER = '/register',
  REGISTER_STEP2 = '/register/step2',
  REGISTER_STEP3 = '/register/step3',
  AUTHENTICATE = '/authenticate',
  SERVER_ERROR = '/server-error'
}

export default Path;
