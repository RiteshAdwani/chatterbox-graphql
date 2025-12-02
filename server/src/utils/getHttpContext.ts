import { type Request } from 'express';

interface HttpContextRequest extends Request {
  auth?: { sub: string };
}

export const getHttpContext = async ({ req }: { req: HttpContextRequest }) => {
  console.log("req.auth", req.auth);
  if (req.auth) {
    return { user: req.auth.sub };
  }
  return {};
};
