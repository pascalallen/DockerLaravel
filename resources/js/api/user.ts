import apiRequest from '@/api/apiRequest';
import apiUrl from '@/constants/apiUrl';
import httpMethod from '@/constants/httpMethod';

const remove = async (id: number): Promise<null> => {
  return apiRequest.send({ method: httpMethod.DELETE, uri: `${apiUrl.URL_USERS}/${id}`, options: { auth: true } });
};

const update = async (
  params: { name: string; password?: string; password_confirmation?: string; google2fa_secret?: string },
  id: number
): Promise<{ name: string; google2fa_secret: string }> => {
  return apiRequest.send({
    method: httpMethod.PUT,
    uri: `${apiUrl.URL_USERS}/${id}`,
    body: params,
    options: { auth: true }
  });
};

export default Object.freeze({
  remove,
  update
});
