import {
  ApolloClient,
  InMemoryCache,
  HttpLink,
  ApolloLink,
  concat,
} from "@apollo/client";
import { onError } from "@apollo/client/link/error";

const v2 = new HttpLink({ uri: process.env.REACT_APP_GRAPHQL_BASE_URL });
const old = new HttpLink({ uri: process.env.REACT_APP_GRAPHQL_BASE_URL_OLD });

const authMiddleware = new ApolloLink((operation, forward) => {
  const t = JSON.parse(localStorage.getItem("x-token"));
  // add the authorization to the headers
  operation.setContext(({ headers = {} }) => ({
    headers: {
      ...headers,
      "x-token": t || undefined,
    },
  }));

  return forward(operation);
});

const unauthorizedV2 = onError(({ networkError }) => {
  // if (networkError?.statusCode === 401) SSOLogin();
});

/* This is the Apollo Client. It is the main tool that we use to interact with the GraphQL API. */
export const client = new ApolloClient({
  link: ApolloLink.split(
    (operation) => operation.getContext().clientName === "old_api",
    old,
    unauthorizedV2.concat(authMiddleware).concat(v2)
  ),
  // link: unauthorizedV2.concat(authMiddleware).concat(v2),
  cache: new InMemoryCache({
    addTypename: false,
  }),
  defaultOptions: {
    watchQuery: {
      fetchPolicy: "no-cache",
      errorPolicy: "none",
    },
    query: {
      fetchPolicy: "no-cache",
      errorPolicy: "none",
    },
  },
});
