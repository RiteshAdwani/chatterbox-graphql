import { PubSub } from 'graphql-subscriptions';

// Create a single PubSub instance to be shared across the application
export const pubsub = new PubSub();
