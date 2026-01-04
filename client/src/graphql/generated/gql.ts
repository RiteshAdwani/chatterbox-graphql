/* eslint-disable */
import * as types from './graphql';
import { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';

/**
 * Map of all GraphQL operations in the project.
 *
 * This map has several performance disadvantages:
 * 1. It is not tree-shakeable, so it will include all operations in the project.
 * 2. It is not minifiable, so the string of a GraphQL query will be multiple times inside the bundle.
 * 3. It does not support dead code elimination, so it will add unused operations.
 *
 * Therefore it is highly recommended to use the babel or swc plugin for production.
 * Learn more about it here: https://the-guild.dev/graphql/codegen/plugins/presets/preset-client#reducing-bundle-size
 */
type Documents = {
    "\n  mutation Login($input: LoginInput!) {\n    login(input: $input) {\n      accessToken\n      refreshToken\n    }\n  }\n": typeof types.LoginDocument,
    "\n  mutation Signup($input: SignupInput!) {\n    signup(input: $input) {\n      accessToken\n      refreshToken\n    }\n  }\n": typeof types.SignupDocument,
    "\n  mutation Logout {\n    logout\n  }\n": typeof types.LogoutDocument,
    "\n  mutation RefreshToken($refreshToken: String!) {\n    refresh(refreshToken: $refreshToken) {\n      accessToken\n      refreshToken\n    }\n  }\n": typeof types.RefreshTokenDocument,
    "\n  mutation CreateChat($input: CreateChatInput!) {\n    createChat(input: $input) {\n      id\n      name\n      type\n      participants {\n        id\n        username\n        email\n      }\n      createdAt\n    }\n  }\n": typeof types.CreateChatDocument,
    "\n  mutation SendMessage($input: SendMessageInput!) {\n    sendMessage(input: $input) {\n      id\n      chatId\n      text\n      createdAt\n      from {\n        id\n        username\n        email\n      }\n    }\n  }\n": typeof types.SendMessageDocument,
    "\n  query GetChats {\n    chats {\n      id\n      name\n      type\n      participants {\n        id\n        username\n        email\n      }\n      lastMessage {\n        id\n        text\n        createdAt\n        from {\n          id\n          username\n        }\n      }\n      createdAt\n    }\n  }\n": typeof types.GetChatsDocument,
    "\n  query GetChat($id: ID!) {\n    chat(id: $id) {\n      id\n      name\n      type\n      participants {\n        id\n        username\n        email\n      }\n      messages {\n        id\n        text\n        createdAt\n        from {\n          id\n          username\n        }\n      }\n      createdAt\n    }\n  }\n": typeof types.GetChatDocument,
    "\n  query GetMessages($chatId: ID!) {\n    messages(chatId: $chatId) {\n      id\n      chatId\n      text\n      createdAt\n      from {\n        id\n        username\n        email\n      }\n    }\n  }\n": typeof types.GetMessagesDocument,
    "\n  query GetProfile {\n    profile {\n      id\n      username\n      email\n    }\n  }\n": typeof types.GetProfileDocument,
    "\n  query GetUsers {\n    users {\n      id\n      username\n      email\n    }\n  }\n": typeof types.GetUsersDocument,
    "\n  subscription MessageSent($chatId: ID!) {\n    messageSent(chatId: $chatId) {\n      id\n      chatId\n      text\n      createdAt\n      from {\n        id\n        username\n        email\n      }\n    }\n  }\n": typeof types.MessageSentDocument,
};
const documents: Documents = {
    "\n  mutation Login($input: LoginInput!) {\n    login(input: $input) {\n      accessToken\n      refreshToken\n    }\n  }\n": types.LoginDocument,
    "\n  mutation Signup($input: SignupInput!) {\n    signup(input: $input) {\n      accessToken\n      refreshToken\n    }\n  }\n": types.SignupDocument,
    "\n  mutation Logout {\n    logout\n  }\n": types.LogoutDocument,
    "\n  mutation RefreshToken($refreshToken: String!) {\n    refresh(refreshToken: $refreshToken) {\n      accessToken\n      refreshToken\n    }\n  }\n": types.RefreshTokenDocument,
    "\n  mutation CreateChat($input: CreateChatInput!) {\n    createChat(input: $input) {\n      id\n      name\n      type\n      participants {\n        id\n        username\n        email\n      }\n      createdAt\n    }\n  }\n": types.CreateChatDocument,
    "\n  mutation SendMessage($input: SendMessageInput!) {\n    sendMessage(input: $input) {\n      id\n      chatId\n      text\n      createdAt\n      from {\n        id\n        username\n        email\n      }\n    }\n  }\n": types.SendMessageDocument,
    "\n  query GetChats {\n    chats {\n      id\n      name\n      type\n      participants {\n        id\n        username\n        email\n      }\n      lastMessage {\n        id\n        text\n        createdAt\n        from {\n          id\n          username\n        }\n      }\n      createdAt\n    }\n  }\n": types.GetChatsDocument,
    "\n  query GetChat($id: ID!) {\n    chat(id: $id) {\n      id\n      name\n      type\n      participants {\n        id\n        username\n        email\n      }\n      messages {\n        id\n        text\n        createdAt\n        from {\n          id\n          username\n        }\n      }\n      createdAt\n    }\n  }\n": types.GetChatDocument,
    "\n  query GetMessages($chatId: ID!) {\n    messages(chatId: $chatId) {\n      id\n      chatId\n      text\n      createdAt\n      from {\n        id\n        username\n        email\n      }\n    }\n  }\n": types.GetMessagesDocument,
    "\n  query GetProfile {\n    profile {\n      id\n      username\n      email\n    }\n  }\n": types.GetProfileDocument,
    "\n  query GetUsers {\n    users {\n      id\n      username\n      email\n    }\n  }\n": types.GetUsersDocument,
    "\n  subscription MessageSent($chatId: ID!) {\n    messageSent(chatId: $chatId) {\n      id\n      chatId\n      text\n      createdAt\n      from {\n        id\n        username\n        email\n      }\n    }\n  }\n": types.MessageSentDocument,
};

/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 *
 *
 * @example
 * ```ts
 * const query = graphql(`query GetUser($id: ID!) { user(id: $id) { name } }`);
 * ```
 *
 * The query argument is unknown!
 * Please regenerate the types.
 */
export function graphql(source: string): unknown;

/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation Login($input: LoginInput!) {\n    login(input: $input) {\n      accessToken\n      refreshToken\n    }\n  }\n"): (typeof documents)["\n  mutation Login($input: LoginInput!) {\n    login(input: $input) {\n      accessToken\n      refreshToken\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation Signup($input: SignupInput!) {\n    signup(input: $input) {\n      accessToken\n      refreshToken\n    }\n  }\n"): (typeof documents)["\n  mutation Signup($input: SignupInput!) {\n    signup(input: $input) {\n      accessToken\n      refreshToken\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation Logout {\n    logout\n  }\n"): (typeof documents)["\n  mutation Logout {\n    logout\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation RefreshToken($refreshToken: String!) {\n    refresh(refreshToken: $refreshToken) {\n      accessToken\n      refreshToken\n    }\n  }\n"): (typeof documents)["\n  mutation RefreshToken($refreshToken: String!) {\n    refresh(refreshToken: $refreshToken) {\n      accessToken\n      refreshToken\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation CreateChat($input: CreateChatInput!) {\n    createChat(input: $input) {\n      id\n      name\n      type\n      participants {\n        id\n        username\n        email\n      }\n      createdAt\n    }\n  }\n"): (typeof documents)["\n  mutation CreateChat($input: CreateChatInput!) {\n    createChat(input: $input) {\n      id\n      name\n      type\n      participants {\n        id\n        username\n        email\n      }\n      createdAt\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation SendMessage($input: SendMessageInput!) {\n    sendMessage(input: $input) {\n      id\n      chatId\n      text\n      createdAt\n      from {\n        id\n        username\n        email\n      }\n    }\n  }\n"): (typeof documents)["\n  mutation SendMessage($input: SendMessageInput!) {\n    sendMessage(input: $input) {\n      id\n      chatId\n      text\n      createdAt\n      from {\n        id\n        username\n        email\n      }\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query GetChats {\n    chats {\n      id\n      name\n      type\n      participants {\n        id\n        username\n        email\n      }\n      lastMessage {\n        id\n        text\n        createdAt\n        from {\n          id\n          username\n        }\n      }\n      createdAt\n    }\n  }\n"): (typeof documents)["\n  query GetChats {\n    chats {\n      id\n      name\n      type\n      participants {\n        id\n        username\n        email\n      }\n      lastMessage {\n        id\n        text\n        createdAt\n        from {\n          id\n          username\n        }\n      }\n      createdAt\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query GetChat($id: ID!) {\n    chat(id: $id) {\n      id\n      name\n      type\n      participants {\n        id\n        username\n        email\n      }\n      messages {\n        id\n        text\n        createdAt\n        from {\n          id\n          username\n        }\n      }\n      createdAt\n    }\n  }\n"): (typeof documents)["\n  query GetChat($id: ID!) {\n    chat(id: $id) {\n      id\n      name\n      type\n      participants {\n        id\n        username\n        email\n      }\n      messages {\n        id\n        text\n        createdAt\n        from {\n          id\n          username\n        }\n      }\n      createdAt\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query GetMessages($chatId: ID!) {\n    messages(chatId: $chatId) {\n      id\n      chatId\n      text\n      createdAt\n      from {\n        id\n        username\n        email\n      }\n    }\n  }\n"): (typeof documents)["\n  query GetMessages($chatId: ID!) {\n    messages(chatId: $chatId) {\n      id\n      chatId\n      text\n      createdAt\n      from {\n        id\n        username\n        email\n      }\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query GetProfile {\n    profile {\n      id\n      username\n      email\n    }\n  }\n"): (typeof documents)["\n  query GetProfile {\n    profile {\n      id\n      username\n      email\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query GetUsers {\n    users {\n      id\n      username\n      email\n    }\n  }\n"): (typeof documents)["\n  query GetUsers {\n    users {\n      id\n      username\n      email\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  subscription MessageSent($chatId: ID!) {\n    messageSent(chatId: $chatId) {\n      id\n      chatId\n      text\n      createdAt\n      from {\n        id\n        username\n        email\n      }\n    }\n  }\n"): (typeof documents)["\n  subscription MessageSent($chatId: ID!) {\n    messageSent(chatId: $chatId) {\n      id\n      chatId\n      text\n      createdAt\n      from {\n        id\n        username\n        email\n      }\n    }\n  }\n"];

export function graphql(source: string) {
  return (documents as any)[source] ?? {};
}

export type DocumentType<TDocumentNode extends DocumentNode<any, any>> = TDocumentNode extends DocumentNode<  infer TType,  any>  ? TType  : never;