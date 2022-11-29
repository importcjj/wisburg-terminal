import {
  ApolloClient,
  InMemoryCache,
  HttpLink,
  ApolloLink,
  concat,
} from "@apollo/client";
import { onError } from "@apollo/client/link/error";
// import { SSOLogin } from './sso/sso';

const httpLink = new HttpLink({ uri: process.env.REACT_APP_GRAPHQL_BASE_URL });

const authMiddleware = new ApolloLink((operation, forward) => {
  // add the authorization to the headers
  operation.setContext(({ headers = {} }) => ({
    headers: {
      ...headers,
      "x-token": localStorage.getItem("x-token") || undefined,
    },
  }));

  return forward(operation);
});

const unauthorized = onError(({ networkError }) => {
  // if (networkError?.statusCode === 401) SSOLogin();
});

/* This is the Apollo Client. It is the main tool that we use to interact with the GraphQL API. */
export const client = new ApolloClient({
  link: unauthorized.concat(authMiddleware).concat(httpLink),
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
