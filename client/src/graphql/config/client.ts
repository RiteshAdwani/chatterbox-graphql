import {
  ApolloClient,
  ApolloLink,
  concat,
  createHttpLink,
  InMemoryCache,
  split,
  type Operation,
  Observable,
} from "@apollo/client";
import { onError } from "@apollo/client/link/error";
import { GraphQLWsLink } from "@apollo/client/link/subscriptions";
import { getMainDefinition } from "@apollo/client/utilities";
import { Kind, OperationTypeNode } from "graphql";
import { createClient as createWsClient } from "graphql-ws";
import { getLocalStorageData, setLocalStorageData, removeLocalStorageData } from "../../utils/localStorage";
import { LOCAL_STORAGE_KEYS } from "../../constants/localStorageKeys";
import { REFRESH_TOKEN_MUTATION } from "../mutations/auth";

let isRefreshing = false;
let pendingRequests: Array<() => void> = [];

// Get GraphQL endpoints from environment variables
const GRAPHQL_HTTP_URI = import.meta.env.VITE_GRAPHQL_HTTP_URI || 'http://localhost:9000/graphql';
const GRAPHQL_WS_URI = import.meta.env.VITE_GRAPHQL_WS_URI || 'ws://localhost:9000/graphql';

// Function to refresh the access token
const refreshAccessToken = async (): Promise<string | null> => {
  const refreshToken = getLocalStorageData<string>(LOCAL_STORAGE_KEYS.REFRESH_TOKEN);
  
  if (!refreshToken) {
    console.error("No refresh token available");
    return null;
  }

  try {
    const response = await fetch(GRAPHQL_HTTP_URI, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        query: REFRESH_TOKEN_MUTATION.loc?.source.body,
        variables: { refreshToken },
      }),
    });

    const { data, errors } = await response.json();

    if (errors || !data?.refresh) {
      throw new Error("Failed to refresh token");
    }

    // Store new tokens
    setLocalStorageData(LOCAL_STORAGE_KEYS.ACCESS_TOKEN, data.refresh.accessToken);
    setLocalStorageData(LOCAL_STORAGE_KEYS.REFRESH_TOKEN, data.refresh.refreshToken);

    console.log("Token refreshed successfully");
    return data.refresh.accessToken;
  } catch (err) {
    // Clear all tokens on refresh failure
    console.error("Token refresh failed:", err);
    removeLocalStorageData(LOCAL_STORAGE_KEYS.ACCESS_TOKEN);
    removeLocalStorageData(LOCAL_STORAGE_KEYS.REFRESH_TOKEN);
    removeLocalStorageData(LOCAL_STORAGE_KEYS.USER);
    
    // Redirect to login
    window.location.href = "/login";
    return null;
  }
};

// Error link to handle token expiration  
const errorLink = onError(({ error, operation, forward }) => {
  // Check if this is a GraphQL error with the errors array
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const graphQLErrors = (error as any)?.errors;
  
  // Check for GraphQL errors
  if (graphQLErrors && Array.isArray(graphQLErrors)) {
    for (const err of graphQLErrors) {
      console.error(
        `[GraphQL error]: Message: ${err.message}, Path: ${err.path}`
      );
      
      // Check if the error is due to token expiration or authentication issues
      if (
        err.message.includes("jwt expired") ||
        err.message.includes("invalid token") ||
        err.message.includes("not authenticated") ||
        err.extensions?.code === "UNAUTHENTICATED"
      ) {
        // Don't try to refresh on the refresh mutation itself
        if (operation.operationName === "RefreshToken") {
          return;
        }

        if (!isRefreshing) {
          isRefreshing = true;

          return new Observable((observer) => {
            refreshAccessToken()
              .then((newAccessToken) => {
                if (!newAccessToken) {
                  throw new Error("Failed to refresh token");
                }

                // Update the operation context with new token
                const oldHeaders = operation.getContext().headers;
                operation.setContext({
                  headers: {
                    ...oldHeaders,
                    Authorization: `Bearer ${newAccessToken}`,
                  },
                });

                // Resolve all pending requests
                pendingRequests.forEach((callback) => callback());
                pendingRequests = [];

                isRefreshing = false;

                // Retry the operation
                const subscriber = {
                  next: observer.next.bind(observer),
                  error: observer.error.bind(observer),
                  complete: observer.complete.bind(observer),
                };
                forward(operation).subscribe(subscriber);
              })
              .catch((refreshError) => {
                // Clear pending requests on error
                pendingRequests = [];
                isRefreshing = false;
                observer.error(refreshError);
              });
          });
        } else {
          // If already refreshing, queue this request
          return new Observable((observer) => {
            pendingRequests.push(() => {
              const subscriber = {
                next: observer.next.bind(observer),
                error: observer.error.bind(observer),
                complete: observer.complete.bind(observer),
              };
              forward(operation).subscribe(subscriber);
            });
          });
        }
      }
    }
  }
  
  // Check for network errors that might indicate JWT expiration
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const networkError = (error as any)?.networkError;
  
  if (networkError) {
    console.error(`[Network error]:`, networkError);
    
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const serverError = networkError as any;
    
    // Check if the error is a 401 (Unauthorized - JWT expired)
    if (
      serverError?.statusCode === 401 ||
      networkError.message?.includes('jwt expired') ||
      networkError.message?.includes('invalid token') ||
      networkError.message?.includes('UnauthorizedError')
    ) {
      console.error("JWT error in network layer, attempting refresh");
      
      // Don't try to refresh on the refresh mutation itself
      if (operation.operationName === "RefreshToken") {
        return;
      }

      if (!isRefreshing) {
        isRefreshing = true;

        return new Observable((observer) => {
          refreshAccessToken()
            .then((newAccessToken) => {
              if (!newAccessToken) {
                throw new Error("Failed to refresh token");
              }

              // Update the operation context with new token
              const oldHeaders = operation.getContext().headers;
              operation.setContext({
                headers: {
                  ...oldHeaders,
                  Authorization: `Bearer ${newAccessToken}`,
                },
              });

              // Resolve all pending requests
              pendingRequests.forEach((callback) => callback());
              pendingRequests = [];

              isRefreshing = false;

              // Retry the operation
              const subscriber = {
                next: observer.next.bind(observer),
                error: observer.error.bind(observer),
                complete: observer.complete.bind(observer),
              };
              forward(operation).subscribe(subscriber);
            })
            .catch((refreshError) => {
              // Clear pending requests on error
              pendingRequests = [];
              isRefreshing = false;
              observer.error(refreshError);
            });
        });
      } else {
        // If already refreshing, queue this request
        return new Observable((observer) => {
          pendingRequests.push(() => {
            const subscriber = {
              next: observer.next.bind(observer),
              error: observer.error.bind(observer),
              complete: observer.complete.bind(observer),
            };
            forward(operation).subscribe(subscriber);
          });
        });
      }
    }
  }
});

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

// HTTP connection to the API (chain error link, auth link, and http link)
const httpLink = concat(
  errorLink,
  concat(authLink, createHttpLink({ uri: GRAPHQL_HTTP_URI }))
);

// WebSocket connection for subscriptions
const wsLink = new GraphQLWsLink(
  createWsClient({
    url: GRAPHQL_WS_URI,
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
