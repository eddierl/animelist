import { ApolloClient, InMemoryCache, HttpLink } from "@apollo/client";
import { persistCache, LocalStorageWrapper } from "apollo3-cache-persist";

const cache = new InMemoryCache();
await persistCache({
  cache,
  storage: new LocalStorageWrapper(window.localStorage),
});

const client = new ApolloClient({
  link: new HttpLink({ uri: "https://graphql.anilist.co" }),
  cache,
});

export default client;
