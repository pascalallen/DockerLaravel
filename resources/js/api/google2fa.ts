import apiRequest from '@/api/apiRequest';
import apiUrl from '@/constants/apiUrl';
import httpMethod from '@/constants/httpMethod';
import { Google2faQRCodeData } from '@/types/data';

const getQRCode = async (): Promise<Google2faQRCodeData> => {
  return apiRequest.send({
    method: httpMethod.GET,
    uri: `${apiUrl.URL_2FA}/qr-code`,
    options: { auth: true }
  });
};

export default Object.freeze({
  getQRCode
});
