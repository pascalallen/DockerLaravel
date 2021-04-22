import { AnyObject } from '@/types/common';

export type AuthData = {
  id: number;
  name: string;
  email: string;
  access_token?: string;
  roles?: AnyObject[];
  permissions?: AnyObject[];
};

export type RoleDataRecord = {
  id: number;
  name: string;
};

export type Google2faQRCodeData = {
  qr_code: string;
  google2fa_secret: string;
};
