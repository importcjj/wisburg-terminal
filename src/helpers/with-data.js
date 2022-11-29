import React from "react";
import { client } from "./init-apollo";
import { ApolloProvider } from "@apollo/client";

/**
 * The function takes in a component and returns a new component that wraps the original component.
 *
 * The new component will render the original component, but will also render the ApolloProvider
 * component.
 *
 * The ApolloProvider component will provide the Apollo client to the original component
 * @returns The ApolloProvider component.
 */
const WithData = ({ children }) => {
  return <ApolloProvider client={client}>{children}</ApolloProvider>;
};

export default WithData;
