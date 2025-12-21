import type { ApolloLink } from "@apollo/client";

// Determine if operation is a refresh token request
export function isRefreshRequest(operation: ApolloLink.Operation) {
  return operation.operationName === "RefreshToken";
}
