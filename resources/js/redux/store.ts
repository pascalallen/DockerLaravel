import { ThunkAction } from 'redux-thunk';
import { configureStore, Action } from '@reduxjs/toolkit';
import storePersist from '@/redux/storePersist';
import user from '@/redux/userSlice';

const store = configureStore({
  reducer: {
    user
  },
  preloadedState: storePersist.loadState()
});

export type AppDispatch = typeof store.dispatch;

export type AppThunk = ThunkAction<void, typeof store, unknown, Action<string>>;

export default store;
