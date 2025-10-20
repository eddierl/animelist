"use client";
import { AnimeList } from "@/app/components/InformationPage/AnimeList";
import client from "@/lib/apollo";
import { ApolloProvider } from "@apollo/client/react";

const AnimePage = () => (
  <ApolloProvider client={client}>
    <AnimeList />
  </ApolloProvider>
);

export default AnimePage;
