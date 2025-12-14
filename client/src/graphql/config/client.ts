import {
  ApolloClient,
  ApolloLink,
  concat,
  createHttpLink,
  InMemoryCache,
  split,
  type Operation,
} from "@apollo/client";
import { GraphQLWsLink } from "@apollo/client/link/subscriptions";
import { getMainDefinition } from "@apollo/client/utilities";
import { Kind, OperationTypeNode } from "graphql";
import { createClient as createWsClient } from "graphql-ws";
import { getLocalStorageData } from "../../utils/localStorage";
import { LOCAL_STORAGE_KEYS } from "../../constants/localStorageKeys";

// Auth link to add token to headers
const authLink = new ApolloLink((operation, forward) => {
  const accessToken = getLocalStorageData<string>(LOCAL_STORAGE_KEYS.ACCESS_TOKEN);
  if (accessToken) {
    operation.setContext({
      headers: { Authorization: `Bearer ${accessToken}` },
    });
  }
  return forward(operation);
});

// HTTP connection to the API
const httpLink = concat(
  authLink,
  createHttpLink({ uri: "http://localhost:9000/graphql" })
);

// WebSocket connection for subscriptions
const wsLink = new GraphQLWsLink(
  createWsClient({
    url: "ws://localhost:9000/graphql",
    connectionParams: () => ({
      accessToken: getLocalStorageData<string>(LOCAL_STORAGE_KEYS.ACCESS_TOKEN),
    }),
  })
);

// Split based on operation type
function isSubscription(operation: Operation) {
  const definition = getMainDefinition(operation.query);
  return (
    definition.kind === Kind.OPERATION_DEFINITION &&
    definition.operation === OperationTypeNode.SUBSCRIPTION
  );
}

// Create Apollo Client
export const apolloClient = new ApolloClient({
  link: split(isSubscription, wsLink, httpLink),
  cache: new InMemoryCache()
});
