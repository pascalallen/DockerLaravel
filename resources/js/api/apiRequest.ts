import apiService from '@/api/apiService';
import httpMethod from '@/constants/httpMethod';
import { AnyObject } from '@/types/common';
import { ApiOptions } from '@/types/api';

type ApiRequestProps = {
  method: string;
  uri: string;
  body?: AnyObject;
  options?: ApiOptions;
};

const send = async (props: ApiRequestProps): Promise<any> => {
  try {
    const api = await apiService.create(props.options);
    switch (props.method) {
      case httpMethod.DELETE: {
        const res = await api.delete(props.uri);
        return res.data;
      }
      case httpMethod.GET: {
        const res = await api.get(props.uri);
        return res.data;
      }
      case httpMethod.PATCH: {
        const res = await api.patch(props.uri, props.body);
        return res.data;
      }
      case httpMethod.POST: {
        const res = await api.post(props.uri, props.body);
        return res.data;
      }
      case httpMethod.PUT: {
        const res = await api.put(props.uri, props.body);
        return res.data;
      }
      default: {
        throw new Error('Unexpected method');
      }
    }
  } catch (error) {
    throw error;
  }
};

export default Object.freeze({
  send
});
