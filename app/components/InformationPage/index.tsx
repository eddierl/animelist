"use client";
import { AnimeList } from "@/app/components/InformationPage/AnimeList";
import client from "@/lib/apollo";
import { ApolloProvider } from "@apollo/client/react";

export default () => (
  <ApolloProvider client={client}>
    <AnimeList />
  </ApolloProvider>
);
