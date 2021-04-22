import { State as UserState } from '@/redux/userSlice';

export type RootState = {
  user: UserState;
};
