import type { SignupInput } from '../types.js';
import { connection } from './connection.js';

const getUserTable = () => connection.table('user');

export async function getUser(username: string) {
  return await getUserTable().first().where({ username });
}

export async function findUserByEmail(email: string) {
  return connection('user').where({ email }).first();
}

export async function createUser(input: SignupInput) {
  return connection('user').insert({
    username: input.username,
    email: input.email,
    password: input.password,
  });
}
