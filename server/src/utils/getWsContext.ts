import { decodeToken } from './decodeToken';

export const getWsContext = ({ connectionParams }: any) => {
  console.log("connectionParams", connectionParams);
  const accessToken = connectionParams?.accessToken;
  if (accessToken) {
    const payload = decodeToken(accessToken);
    return { user: payload.sub };
  }
  return {};
};
