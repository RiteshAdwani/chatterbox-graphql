import {
  ApolloClient,
  ApolloLink,
  HttpLink,
  InMemoryCache,
  Observable,
  type FetchResult,
} from "@apollo/client";
import { onError } from "@apollo/client/link/error";
import { GraphQLWsLink } from "@apollo/client/link/subscriptions";
import { createClient as createWsClient } from "graphql-ws";
import { getLocalStorageData } from "../../utils/localStorage";
import { LOCAL_STORAGE_KEYS } from "../../constants/localStorageKeys";
import { isSubscription } from "../../utils/isSubscription";
import { isRefreshRequest } from "../../utils/isRefreshTokeRequest";
import { refreshAccessToken } from "../../utils/refreshAccessToken";

let isRefreshing = false;
let pendingRequests: Array<() => void> = [];

// Helper function to handle token refresh logic
const handleTokenRefresh = (
  operation: Parameters<Parameters<typeof onError>[0]>[0]['operation'],
  forward: Parameters<Parameters<typeof onError>[0]>[0]['forward'],
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  observer: any
) => {
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
};

// Helper function to queue a request while refresh is in progress
const queueRequest = (
  operation: Parameters<Parameters<typeof onError>[0]>[0]['operation'],
  forward: Parameters<Parameters<typeof onError>[0]>[0]['forward']
) => {
  return new Observable<FetchResult>((observer) => {
    pendingRequests.push(() => {
      const subscriber = {
        next: observer.next.bind(observer),
        error: observer.error.bind(observer),
        complete: observer.complete.bind(observer),
      };
      forward(operation).subscribe(subscriber);
    });
  });
};

// Get GraphQL endpoints from environment variables
const GRAPHQL_HTTP_URI =
  import.meta.env.VITE_GRAPHQL_HTTP_URI || "http://localhost:9000/graphql";
const GRAPHQL_WS_URI =
  import.meta.env.VITE_GRAPHQL_WS_URI || "ws://localhost:9000/graphql";

// Auth link to add token to headers
const authLink = new ApolloLink((operation, forward) => {
  // Use refresh token for refresh operation, access token for others
  const token = isRefreshRequest(operation)
    ? getLocalStorageData(LOCAL_STORAGE_KEYS.REFRESH_TOKEN)
    : getLocalStorageData(LOCAL_STORAGE_KEYS.ACCESS_TOKEN);

  if (token) {
    operation.setContext({
      headers: { Authorization: `Bearer ${token}` },
    });
  }
  return forward(operation);
});

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
          return new Observable<FetchResult>((observer) => {
            handleTokenRefresh(operation, forward, observer);
          });
        } else {
          // If already refreshing, queue this request
          return queueRequest(operation, forward);
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
      networkError.message?.includes("jwt expired") ||
      networkError.message?.includes("invalid token") ||
      networkError.message?.includes("UnauthorizedError")
    ) {
      console.error("JWT error in network layer, attempting refresh");

      // Don't try to refresh on the refresh mutation itself
      if (operation.operationName === "RefreshToken") {
        return;
      }

      if (!isRefreshing) {
        isRefreshing = true;
        return new Observable<FetchResult>((observer) => {
          handleTokenRefresh(operation, forward, observer);
        });
      } else {
        // If already refreshing, queue this request
        return queueRequest(operation, forward);
      }
    }
  }
});

// HTTP connection to the API (chain error link, auth link, and http link)
const httpLink = ApolloLink.from([
  errorLink,
  authLink,
  new HttpLink({ uri: GRAPHQL_HTTP_URI }),
]);

// WebSocket connection for subscriptions
const wsLink = new GraphQLWsLink(
  createWsClient({
    url: GRAPHQL_WS_URI,
    connectionParams: () => ({
      accessToken: getLocalStorageData<string>(LOCAL_STORAGE_KEYS.ACCESS_TOKEN),
    }),
  })
);

// Create Apollo Client and assign to the declared variable
const apolloClient = new ApolloClient({
  link: ApolloLink.split(isSubscription, wsLink, httpLink),
  cache: new InMemoryCache(),
});

// Export the client
export { apolloClient };
