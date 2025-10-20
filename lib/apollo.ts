"use client";
import { ApolloClient, InMemoryCache, HttpLink } from "@apollo/client";
import { persistCache, LocalStorageWrapper } from "apollo3-cache-persist";

const cache = new InMemoryCache();

const client = new ApolloClient({
  link: new HttpLink({ uri: "https://graphql.anilist.co" }),
  cache,
});

if (typeof window !== "undefined") {
  persistCache({
    cache,
    storage: new LocalStorageWrapper(window.localStorage),
  });
}

export default client;
