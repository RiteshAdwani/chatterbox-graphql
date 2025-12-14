import { connection } from '../db/connection.js';
import { hashPassword } from '../utils/password.js';

await connection.schema.dropTableIfExists('message');
await connection.schema.dropTableIfExists('chat_participant');
await connection.schema.dropTableIfExists('chat');
await connection.schema.dropTableIfExists('refresh_token');
await connection.schema.dropTableIfExists('blacklisted_token');
await connection.schema.dropTableIfExists('user');

await connection.schema.createTable('user', (table) => {
  table.increments('id').primary();
  table.text('username').notNullable().unique();
  table.text('email').notNullable().unique();
  table.text('password').notNullable();
});

await connection.schema.createTable('chat', (table) => {
  table.text('id').notNullable().primary();
  table.text('name'); // Optional, for group chats
  table.text('type').notNullable(); // 'DIRECT' or 'GROUP'
  table.text('createdAt').notNullable();
});

await connection.schema.createTable('chat_participant', (table) => {
  table.text('chatId').notNullable();
  table.integer('userId').notNullable();
  table.text('joinedAt').notNullable();
  table.primary(['chatId', 'userId']);
  table.foreign('chatId').references('chat.id').onDelete('CASCADE');
  table.foreign('userId').references('user.id').onDelete('CASCADE');
});

await connection.schema.createTable('message', (table) => {
  table.text('id').notNullable().primary();
  table.text('chatId').notNullable();
  table.integer('fromUserId').notNullable();
  table.text('text').notNullable();
  table.text('createdAt').notNullable();
  table.foreign('chatId').references('chat.id').onDelete('CASCADE');
  table.foreign('fromUserId').references('user.id').onDelete('CASCADE');
});

await connection.schema.createTable('blacklisted_token', (table) => {
  table.text('token').notNullable().primary();
  table.text('blacklistedAt').notNullable();
});

await connection.schema.createTable('refresh_token', (table) => {
  table.text('token').notNullable().primary();
  table.integer('userId').notNullable();
  table.text('createdAt').notNullable();
  table.text('expiresAt').notNullable();
  table.boolean('revoked').defaultTo(false);
  table.foreign('userId').references('user.id').onDelete('CASCADE');
});

await connection.table('user').insert([
  {
    username: 'alice',
    email: 'alice@example.com',
    password: await hashPassword('alice123'),
  },
  {
    username: 'bob',
    email: 'bob@example.com',
    password: await hashPassword('bob123'),
  },
  {
    username: 'charlie',
    email: 'charlie@example.com',
    password: await hashPassword('charlie123'),
  },
]);

// Create some sample chats
await connection.table('chat').insert([
  {
    id: 'chat001',
    name: null,
    type: 'DIRECT',
    createdAt: '2025-01-31T10:00:00.000Z',
  },
  {
    id: 'chat002',
    name: 'Team Chat',
    type: 'GROUP',
    createdAt: '2025-01-31T10:30:00.000Z',
  },
]);

// Add participants to chats
await connection.table('chat_participant').insert([
  // Direct chat between alice (id: 1) and bob (id: 2)
  { chatId: 'chat001', userId: 1, joinedAt: '2025-01-31T10:00:00.000Z' },
  { chatId: 'chat001', userId: 2, joinedAt: '2025-01-31T10:00:00.000Z' },
  // Group chat with all three
  { chatId: 'chat002', userId: 1, joinedAt: '2025-01-31T10:30:00.000Z' },
  { chatId: 'chat002', userId: 2, joinedAt: '2025-01-31T10:30:00.000Z' },
  { chatId: 'chat002', userId: 3, joinedAt: '2025-01-31T10:30:00.000Z' },
]);

// Add some sample messages
await connection.table('message').insert([
  {
    id: 'msg001',
    chatId: 'chat001',
    fromUserId: 1, // alice
    text: 'Hey Bob! How are you?',
    createdAt: '2025-01-31T11:00:00.000Z',
  },
  {
    id: 'msg002',
    chatId: 'chat001',
    fromUserId: 2, // bob
    text: 'Hi Alice! I\'m good, thanks!',
    createdAt: '2025-01-31T11:01:00.000Z',
  },
  {
    id: 'msg003',
    chatId: 'chat002',
    fromUserId: 3, // charlie
    text: 'Welcome to the team chat!',
    createdAt: '2025-01-31T11:30:00.000Z',
  },
]);

process.exit();
