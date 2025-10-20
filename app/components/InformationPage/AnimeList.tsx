"use client";
import { GET_TOP_ANIME } from "@/lib/queries";

import { useQuery } from "@apollo/client/react";
import { useSearchParams, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import useSWR from "swr";

import Image from "next/image";
export const AnimeList = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedAnime, setSelectedAnime] = useState<any>(null);

  useEffect(() => {
    const page = searchParams.get("page");
    if (page) {
      setCurrentPage(parseInt(page, 10));
    }
  }, [searchParams]);

  // Define fetchAnimeData function
  const fetchAnimeData = async (page: number) => {
    const response = await fetch('https://graphql.anilist.co', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        query: `
          query GetTopAnime($page: Int, $perPage: Int) {
            Page(page: $page, perPage: $perPage) {
              media(type: ANIME, sort: POPULARITY_DESC) {
                id
                title {
                  romaji
                  english
                }
                coverImage {
                  large
                }
                popularity
                averageScore
                description
                genres
                episodes
                duration
                season
                seasonYear
                studios(isMain: true) {
                  nodes {
                    name
                  }
                }
              }
            }
          }
        `,
        variables: { page, perPage: 9 },
      }),
    });
    const result = await response.json();
    return result.data;
  };

  // Using SWR for caching
  const { data: swrData, error: swrError } = useSWR(
    `anime-page-${currentPage}`,
    () => fetchAnimeData(currentPage),
    { revalidateOnFocus: false, dedupingInterval: 60000 }
  );

  const { loading, error, data } = useQuery(GET_TOP_ANIME, {
    variables: { page: currentPage, perPage: 9 },
    skip: !!swrData, // Skip Apollo query if SWR has data
  });

  // Fallback to Apollo data if SWR doesn't have it yet
  const animeData = swrData || data;
  const isLoading = loading && !swrData;
  const hasError = error || swrError;

  if (isLoading) return <p>Loading...</p>;
  if (hasError) return <p>Error: {hasError.message}</p>;

  const animeList = (animeData as any)?.Page?.media || [];

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", newPage.toString());
    router.push(`?${params.toString()}`);
  };

  const goToNextPage = () => handlePageChange(currentPage + 1);
  const goToPreviousPage = () => handlePageChange(Math.max(1, currentPage - 1));

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Top Anime</h1>
      {animeList.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {animeList.map((anime: any) => (
            <div
              key={anime.id}
              className="border rounded-lg p-4 shadow cursor-pointer hover:shadow-lg transition-shadow"
              onClick={() => setSelectedAnime(anime)}
            >
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
      <div className="flex justify-between mt-4">
        <button
          onClick={goToPreviousPage}
          disabled={currentPage === 1}
          className="px-4 py-2 bg-blue-500 text-white rounded disabled:bg-gray-300"
        >
          Previous
        </button>
        <span>Page {currentPage}</span>
        <button
          onClick={goToNextPage}
          className="px-4 py-2 bg-blue-500 text-white rounded"
        >
          Next
        </button>
      </div>

      <Dialog.Root
        open={!!selectedAnime}
        onOpenChange={() => setSelectedAnime(null)}
      >
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 bg-black/50" />
          <Dialog.Content className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-gray-900 p-6 rounded-lg shadow-lg border max-w-2xl w-full max-h-[80vh] overflow-y-auto">
            {selectedAnime && (
              <div className="">
                <Dialog.Title className="text-2xl font-bold mb-4">
                  {selectedAnime.title.english || selectedAnime.title.romaji}
                </Dialog.Title>
                <div className="flex flex-col md:flex-row gap-4">
                  <Image
                    src={selectedAnime.coverImage.large}
                    alt={
                      selectedAnime.title.romaji || selectedAnime.title.english
                    }
                    width={300}
                    height={400}
                    className="w-full md:w-48 h-64 object-cover"
                  />
                  <div className="flex-1">
                    <p className="mb-2">
                      <strong>Description:</strong>{" "}
                      {selectedAnime.description?.replace(/<[^>]*>/g, "") ||
                        "No description available"}
                    </p>
                    <p className="mb-2">
                      <strong>Genres:</strong>{" "}
                      {selectedAnime.genres?.join(", ") || "N/A"}
                    </p>
                    <p className="mb-2">
                      <strong>Episodes:</strong>{" "}
                      {selectedAnime.episodes || "N/A"}
                    </p>
                    <p className="mb-2">
                      <strong>Duration:</strong> {selectedAnime.duration}{" "}
                      minutes per episode
                    </p>
                    <p className="mb-2">
                      <strong>Season:</strong> {selectedAnime.season}{" "}
                      {selectedAnime.seasonYear}
                    </p>
                    <p className="mb-2">
                      <strong>Studio:</strong>{" "}
                      {selectedAnime.studios?.nodes?.[0]?.name || "N/A"}
                    </p>
                    <p className="mb-2">
                      <strong>Popularity:</strong> {selectedAnime.popularity}
                    </p>
                    <p className="mb-2">
                      <strong>Average Score:</strong>{" "}
                      {selectedAnime.averageScore}%
                    </p>
                  </div>
                </div>
                <Dialog.Close className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
                  Close
                </Dialog.Close>
              </div>
            )}
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </div>
  );
};
