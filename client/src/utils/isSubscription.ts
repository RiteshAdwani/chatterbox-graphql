import type { ApolloLink } from "@apollo/client";
import { getMainDefinition } from "@apollo/client/utilities";
import { Kind, OperationTypeNode } from "graphql";

export function isSubscription(operation: ApolloLink.Operation) {
  const definition = getMainDefinition(operation.query);
  return (
    definition.kind === Kind.OPERATION_DEFINITION &&
    definition.operation === OperationTypeNode.SUBSCRIPTION
  );
}
