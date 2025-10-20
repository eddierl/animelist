"use client";
import { ApolloProvider } from "@apollo/client/react";
import client from "../lib/apollo";
import { AnimeList } from "@/app/components/AnimeList";

export default function Home() {
  return (
    <ApolloProvider client={client}>
      <AnimeList />
    </ApolloProvider>
  );
}
