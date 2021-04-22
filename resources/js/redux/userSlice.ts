import { createSlice } from '@reduxjs/toolkit';
import { AppThunk } from '@/redux/store';
import { AnyObject } from '@/types/common';
import auth from '@/api/auth';
import userApi from '@/api/user';

export type State = {
  id?: number;
  name?: string;
  email?: string;
  qr_code?: string;
  google2fa_secret?: string;
  access_token?: string;
  roles?: AnyObject[];
  permissions?: AnyObject[];
  message?: string;
};

export const initialState: State = {};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    authenticateSuccess(state, action): State {
      state = action.payload;
      delete state.message;
      return state;
    },
    updateSuccess(state, action): State {
      state.name = action.payload.name;
      state.google2fa_secret = action.payload.google2fa_secret;
      return state;
    },
    logoutSuccess(): State {
      // on logout, reset to initial state
      return initialState;
    }
  }
});

const { authenticateSuccess, updateSuccess, logoutSuccess } = userSlice.actions;

export default userSlice.reducer;

export const register = (params: { name: string; email: string; password: string }): AppThunk => async (
  dispatch
): Promise<void> => {
  try {
    await auth.initializeCsrfProtection().then(async () => {
      const res = await auth.register(params);
      dispatch(authenticateSuccess(res));
    });
  } catch (err) {
    await auth.logout();
    throw err;
  }
};

export const login = (params: { email: string; password: string }): AppThunk => async (dispatch): Promise<void> => {
  try {
    await auth.initializeCsrfProtection().then(async () => {
      const res = await auth.login(params);
      dispatch(authenticateSuccess(res));
    });
  } catch (err) {
    await auth.logout();
    throw err;
  }
};

export const authenticate = (params: { one_time_password: string }): AppThunk => async (dispatch): Promise<void> => {
  try {
    const res = await auth.multifactorAuthentication(params);
    dispatch(authenticateSuccess(res));
  } catch (err) {
    await auth.logout();
    throw err;
  }
};

export const update = (
  params: {
    name: string;
    password?: string;
    password_confirmation?: string;
    google2fa_secret?: string;
  },
  id: number
): AppThunk => async (dispatch): Promise<void> => {
  try {
    const res = await userApi.update(params, id);
    dispatch(updateSuccess(res));
  } catch (err) {
    throw err;
  }
};

export const logout = (): AppThunk => async (dispatch): Promise<void> => {
  try {
    await auth.logout();
  } finally {
    // on logout, reset to initial state
    dispatch(logoutSuccess());
  }
};
