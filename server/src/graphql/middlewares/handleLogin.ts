import type { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { getUser } from '../../db/users';

const secret = Buffer.from('Zn8Q5tyZ/G1MHltc4F/gTkVJMlrbKiZt', 'base64');

export async function handleLogin(req: Request, res: Response) {
  const { username, password } = req.body;
  const user = await getUser(username);
  if (!user || user.password !== password) {
    res.sendStatus(401);
  } else {
    const claims = { sub: username };
    const token = jwt.sign(claims, secret);
    res.json({ token });
  }
}
