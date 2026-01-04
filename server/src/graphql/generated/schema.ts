import { GraphQLResolveInfo } from 'graphql';
import { AuthContext } from '../../utils/requireAuth';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = { [_ in K]?: never };
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
export type RequireFields<T, K extends keyof T> = Omit<T, K> & { [P in K]-?: NonNullable<T[P]> };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string; }
  String: { input: string; output: string; }
  Boolean: { input: boolean; output: boolean; }
  Int: { input: number; output: number; }
  Float: { input: number; output: number; }
};

export type AuthToken = {
  accessToken: Scalars['String']['output'];
  refreshToken: Scalars['String']['output'];
};

export type Chat = {
  createdAt: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  lastMessage?: Maybe<Message>;
  messages: Array<Message>;
  name?: Maybe<Scalars['String']['output']>;
  participants: Array<User>;
  type: ChatType;
};

export enum ChatType {
  Direct = 'DIRECT',
  Group = 'GROUP'
}

export type CreateChatInput = {
  name?: InputMaybe<Scalars['String']['input']>;
  participantUserIds: Array<Scalars['ID']['input']>;
  type: ChatType;
};

export type LoginInput = {
  email: Scalars['String']['input'];
  password: Scalars['String']['input'];
};

export type Message = {
  chatId: Scalars['ID']['output'];
  createdAt: Scalars['String']['output'];
  from: User;
  id: Scalars['ID']['output'];
  text: Scalars['String']['output'];
};

export type Mutation = {
  createChat: Chat;
  login: AuthToken;
  logout: Scalars['Boolean']['output'];
  refresh: AuthToken;
  sendMessage: Message;
  signup: AuthToken;
};


export type MutationCreateChatArgs = {
  input: CreateChatInput;
};


export type MutationLoginArgs = {
  input: LoginInput;
};


export type MutationRefreshArgs = {
  refreshToken: Scalars['String']['input'];
};


export type MutationSendMessageArgs = {
  input: SendMessageInput;
};


export type MutationSignupArgs = {
  input: SignupInput;
};

export type Query = {
  chat?: Maybe<Chat>;
  chats: Array<Chat>;
  hello?: Maybe<Scalars['String']['output']>;
  messages: Array<Message>;
  profile: User;
  users: Array<User>;
};


export type QueryChatArgs = {
  id: Scalars['ID']['input'];
};


export type QueryMessagesArgs = {
  chatId: Scalars['ID']['input'];
};

export type SendMessageInput = {
  chatId: Scalars['ID']['input'];
  text: Scalars['String']['input'];
};

export type SignupInput = {
  email: Scalars['String']['input'];
  password: Scalars['String']['input'];
  username: Scalars['String']['input'];
};

export type Subscription = {
  messageSent: Message;
};


export type SubscriptionMessageSentArgs = {
  chatId: Scalars['ID']['input'];
};

export type User = {
  email: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  username: Scalars['String']['output'];
};

export type WithIndex<TObject> = TObject & Record<string, any>;
export type ResolversObject<TObject> = WithIndex<TObject>;

export type ResolverTypeWrapper<T> = Promise<T> | T;


export type ResolverWithResolve<TResult, TParent, TContext, TArgs> = {
  resolve: ResolverFn<TResult, TParent, TContext, TArgs>;
};
export type Resolver<TResult, TParent = Record<PropertyKey, never>, TContext = Record<PropertyKey, never>, TArgs = Record<PropertyKey, never>> = ResolverFn<TResult, TParent, TContext, TArgs> | ResolverWithResolve<TResult, TParent, TContext, TArgs>;

export type ResolverFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => Promise<TResult> | TResult;

export type SubscriptionSubscribeFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => AsyncIterable<TResult> | Promise<AsyncIterable<TResult>>;

export type SubscriptionResolveFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => TResult | Promise<TResult>;

export interface SubscriptionSubscriberObject<TResult, TKey extends string, TParent, TContext, TArgs> {
  subscribe: SubscriptionSubscribeFn<{ [key in TKey]: TResult }, TParent, TContext, TArgs>;
  resolve?: SubscriptionResolveFn<TResult, { [key in TKey]: TResult }, TContext, TArgs>;
}

export interface SubscriptionResolverObject<TResult, TParent, TContext, TArgs> {
  subscribe: SubscriptionSubscribeFn<any, TParent, TContext, TArgs>;
  resolve: SubscriptionResolveFn<TResult, any, TContext, TArgs>;
}

export type SubscriptionObject<TResult, TKey extends string, TParent, TContext, TArgs> =
  | SubscriptionSubscriberObject<TResult, TKey, TParent, TContext, TArgs>
  | SubscriptionResolverObject<TResult, TParent, TContext, TArgs>;

export type SubscriptionResolver<TResult, TKey extends string, TParent = Record<PropertyKey, never>, TContext = Record<PropertyKey, never>, TArgs = Record<PropertyKey, never>> =
  | ((...args: any[]) => SubscriptionObject<TResult, TKey, TParent, TContext, TArgs>)
  | SubscriptionObject<TResult, TKey, TParent, TContext, TArgs>;

export type TypeResolveFn<TTypes, TParent = Record<PropertyKey, never>, TContext = Record<PropertyKey, never>> = (
  parent: TParent,
  context: TContext,
  info: GraphQLResolveInfo
) => Maybe<TTypes> | Promise<Maybe<TTypes>>;

export type IsTypeOfResolverFn<T = Record<PropertyKey, never>, TContext = Record<PropertyKey, never>> = (obj: T, context: TContext, info: GraphQLResolveInfo) => boolean | Promise<boolean>;

export type NextResolverFn<T> = () => Promise<T>;

export type DirectiveResolverFn<TResult = Record<PropertyKey, never>, TParent = Record<PropertyKey, never>, TContext = Record<PropertyKey, never>, TArgs = Record<PropertyKey, never>> = (
  next: NextResolverFn<TResult>,
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => TResult | Promise<TResult>;





/** Mapping between all available schema types and the resolvers types */
export type ResolversTypes = ResolversObject<{
  AuthToken: ResolverTypeWrapper<AuthToken>;
  Boolean: ResolverTypeWrapper<Scalars['Boolean']['output']>;
  Chat: ResolverTypeWrapper<Chat>;
  ChatType: ChatType;
  CreateChatInput: CreateChatInput;
  ID: ResolverTypeWrapper<Scalars['ID']['output']>;
  LoginInput: LoginInput;
  Message: ResolverTypeWrapper<Message>;
  Mutation: ResolverTypeWrapper<Record<PropertyKey, never>>;
  Query: ResolverTypeWrapper<Record<PropertyKey, never>>;
  SendMessageInput: SendMessageInput;
  SignupInput: SignupInput;
  String: ResolverTypeWrapper<Scalars['String']['output']>;
  Subscription: ResolverTypeWrapper<Record<PropertyKey, never>>;
  User: ResolverTypeWrapper<User>;
}>;

/** Mapping between all available schema types and the resolvers parents */
export type ResolversParentTypes = ResolversObject<{
  AuthToken: AuthToken;
  Boolean: Scalars['Boolean']['output'];
  Chat: Chat;
  CreateChatInput: CreateChatInput;
  ID: Scalars['ID']['output'];
  LoginInput: LoginInput;
  Message: Message;
  Mutation: Record<PropertyKey, never>;
  Query: Record<PropertyKey, never>;
  SendMessageInput: SendMessageInput;
  SignupInput: SignupInput;
  String: Scalars['String']['output'];
  Subscription: Record<PropertyKey, never>;
  User: User;
}>;

export type AuthTokenResolvers<ContextType = AuthContext, ParentType extends ResolversParentTypes['AuthToken'] = ResolversParentTypes['AuthToken']> = ResolversObject<{
  accessToken?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  refreshToken?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
}>;

export type ChatResolvers<ContextType = AuthContext, ParentType extends ResolversParentTypes['Chat'] = ResolversParentTypes['Chat']> = ResolversObject<{
  createdAt?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  lastMessage?: Resolver<Maybe<ResolversTypes['Message']>, ParentType, ContextType>;
  messages?: Resolver<Array<ResolversTypes['Message']>, ParentType, ContextType>;
  name?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  participants?: Resolver<Array<ResolversTypes['User']>, ParentType, ContextType>;
  type?: Resolver<ResolversTypes['ChatType'], ParentType, ContextType>;
}>;

export type MessageResolvers<ContextType = AuthContext, ParentType extends ResolversParentTypes['Message'] = ResolversParentTypes['Message']> = ResolversObject<{
  chatId?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  createdAt?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  from?: Resolver<ResolversTypes['User'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  text?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
}>;

export type MutationResolvers<ContextType = AuthContext, ParentType extends ResolversParentTypes['Mutation'] = ResolversParentTypes['Mutation']> = ResolversObject<{
  createChat?: Resolver<ResolversTypes['Chat'], ParentType, ContextType, RequireFields<MutationCreateChatArgs, 'input'>>;
  login?: Resolver<ResolversTypes['AuthToken'], ParentType, ContextType, RequireFields<MutationLoginArgs, 'input'>>;
  logout?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  refresh?: Resolver<ResolversTypes['AuthToken'], ParentType, ContextType, RequireFields<MutationRefreshArgs, 'refreshToken'>>;
  sendMessage?: Resolver<ResolversTypes['Message'], ParentType, ContextType, RequireFields<MutationSendMessageArgs, 'input'>>;
  signup?: Resolver<ResolversTypes['AuthToken'], ParentType, ContextType, RequireFields<MutationSignupArgs, 'input'>>;
}>;

export type QueryResolvers<ContextType = AuthContext, ParentType extends ResolversParentTypes['Query'] = ResolversParentTypes['Query']> = ResolversObject<{
  chat?: Resolver<Maybe<ResolversTypes['Chat']>, ParentType, ContextType, RequireFields<QueryChatArgs, 'id'>>;
  chats?: Resolver<Array<ResolversTypes['Chat']>, ParentType, ContextType>;
  hello?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  messages?: Resolver<Array<ResolversTypes['Message']>, ParentType, ContextType, RequireFields<QueryMessagesArgs, 'chatId'>>;
  profile?: Resolver<ResolversTypes['User'], ParentType, ContextType>;
  users?: Resolver<Array<ResolversTypes['User']>, ParentType, ContextType>;
}>;

export type SubscriptionResolvers<ContextType = AuthContext, ParentType extends ResolversParentTypes['Subscription'] = ResolversParentTypes['Subscription']> = ResolversObject<{
  messageSent?: SubscriptionResolver<ResolversTypes['Message'], "messageSent", ParentType, ContextType, RequireFields<SubscriptionMessageSentArgs, 'chatId'>>;
}>;

export type UserResolvers<ContextType = AuthContext, ParentType extends ResolversParentTypes['User'] = ResolversParentTypes['User']> = ResolversObject<{
  email?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  username?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
}>;

export type Resolvers<ContextType = AuthContext> = ResolversObject<{
  AuthToken?: AuthTokenResolvers<ContextType>;
  Chat?: ChatResolvers<ContextType>;
  Message?: MessageResolvers<ContextType>;
  Mutation?: MutationResolvers<ContextType>;
  Query?: QueryResolvers<ContextType>;
  Subscription?: SubscriptionResolvers<ContextType>;
  User?: UserResolvers<ContextType>;
}>;

