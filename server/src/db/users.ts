import type { SignupInput } from '../types.js';
import { connection } from './connection.js';

const getUserTable = () => connection.table('user');

export async function dbGetUserByUsername(username: string) {
  return await getUserTable().first().where({ username });
}

export async function dbGetUserById(id: number) {
  return await getUserTable().first().where({ id });
}

export async function dbGetUsersByIds(ids: number[]) {
  return await getUserTable().whereIn('id', ids).select('id', 'username', 'email');
}

export async function dbGetAllUsers() {
  return await getUserTable().select('id', 'username', 'email');
}

export async function dbFindUserByEmail(email: string) {
  return connection('user').where({ email }).first();
}

export async function dbCreateUser(input: SignupInput) {
  const [id] = await connection('user').insert({
    username: input.username,
    email: input.email,
    password: input.password,
  });
  return id;
}
