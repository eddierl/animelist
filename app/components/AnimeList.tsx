"use client"
import { GET_TOP_ANIME } from "@/lib/queries";

import { useQuery } from "@apollo/client/react";

import Image from 'next/image';
export const AnimeList = () => {

      const { loading, error, data } = useQuery(GET_TOP_ANIME, {
    variables: { page: 1, perPage: 10 },
  });

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;




  const animeList = (data as any)?.Page?.media || [];
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Top 10 Anime</h1>
      {animeList.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {animeList.map((anime: any) => (
            <div key={anime.id} className="border rounded-lg p-4 shadow">
              <Image
                src={anime.coverImage.large}
                alt={anime.title.romaji || anime.title.english}
                width={300}
                height={400}
                className="w-full h-64 object-cover mb-2"
              />
              <h2 className="text-lg font-semibold">
                {anime.title.english || anime.title.romaji}
              </h2>
              <p className="text-sm text-gray-600">
                Popularity: {anime.popularity}
              </p>
              <p className="text-sm text-gray-600">
                Average Score: {anime.averageScore}%
              </p>
            </div>
          ))}
        </div>
      ) : (
        <p>No anime data available.</p>
      )}
    </div>
  );

}