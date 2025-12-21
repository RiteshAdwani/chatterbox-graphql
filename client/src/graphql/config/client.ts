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

// Determine if operation is a refresh token request
function isRefreshRequest(operation: Operation) {
  return operation.operationName === 'RefreshToken';
}

// Auth link to add token to headers
const authLink = new ApolloLink((operation, forward) => {
  // Use refresh token for refresh operation, access token for others
  const token = isRefreshRequest(operation)
    ? getLocalStorageData<string>(LOCAL_STORAGE_KEYS.REFRESH_TOKEN)
    : getLocalStorageData<string>(LOCAL_STORAGE_KEYS.ACCESS_TOKEN);
    
  if (token) {
    operation.setContext({
      headers: { Authorization: `Bearer ${token}` },
    });
  }
  return forward(operation);
});

// Declare apolloClient variable that will be assigned after error link is created
// eslint-disable-next-line prefer-const
let apolloClient: ApolloClient;

// Function to refresh the access token using Apollo Client
const refreshAccessToken = async (): Promise<string | null> => {
  try {
    const refreshToken = getLocalStorageData<string>(LOCAL_STORAGE_KEYS.REFRESH_TOKEN);
    
    const response = await apolloClient.mutate<{
      refresh: {
        accessToken: string;
        refreshToken: string;
      };
    }>({
      mutation: REFRESH_TOKEN_MUTATION,
      variables: {
        refreshToken,
      },
    });

    const accessToken = response.data?.refresh?.accessToken;
    const newRefreshToken = response.data?.refresh?.refreshToken;

    if (!accessToken) {
      throw new Error("No access token received");
    }

    // Store new tokens
    setLocalStorageData(LOCAL_STORAGE_KEYS.ACCESS_TOKEN, accessToken);
    if (newRefreshToken) {
      setLocalStorageData(LOCAL_STORAGE_KEYS.REFRESH_TOKEN, newRefreshToken);
    }

    return accessToken;
  } catch (error) {
    console.warn(error)
    // Clear all tokens on refresh failure
    removeLocalStorageData(LOCAL_STORAGE_KEYS.ACCESS_TOKEN);
    removeLocalStorageData(LOCAL_STORAGE_KEYS.REFRESH_TOKEN);
    
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
        `[GraphQL error]: Message: ${err.message}, Code: ${err.extensions?.code}, Path: ${err.path}`
      );
      
      // Check if the error is due to token expiration or authentication issues
      if (
        err.message.includes("jwt expired") ||
        err.message.includes("invalid token") ||
        err.message.includes("not authenticated") ||
        err.message.includes("token expired") ||
        err.extensions?.code === "UNAUTHENTICATED" ||
        err.extensions?.code === "TOKEN_EXPIRED"
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
                console.error("❌ Refresh failed, clearing pending requests");
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

// Create Apollo Client and assign to the declared variable
apolloClient = new ApolloClient({
  link: split(isSubscription, wsLink, httpLink),
  cache: new InMemoryCache()
});

// Export the client
export { apolloClient };
