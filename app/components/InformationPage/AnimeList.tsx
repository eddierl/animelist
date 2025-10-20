"use client";
import { GET_TOP_ANIME } from "@/lib/queries";

import { useQuery } from "@apollo/client/react";
import { useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";

import { Anime, AnimeCard } from "./AnimeCard";
import { AnimeDialog } from "./AnimeDialog";

export const AnimeList = () => {
  const searchParams = useSearchParams();
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedAnime, setSelectedAnime] = useState<Anime | null>(null);

  useEffect(() => {
    const page = searchParams.get("page");
    if (page) {
      setCurrentPage(parseInt(page, 10));
    }
  }, [searchParams]);

  const {
    loading: isLoading,
    error: hasError,
    data: animeData,
  } = useQuery(GET_TOP_ANIME, {
    variables: { page: currentPage, perPage: 9 },
  });

  if (isLoading) return <p>Loading...</p>;
  if (hasError) return <p>Error: {hasError.message}</p>;

  type AnimeList = {
    Page: {
      media: Anime[];
    };
  };
  const animeList = (animeData as AnimeList)?.Page?.media || [];

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
    const params = new URLSearchParams(window.location.search);
    params.set("page", newPage.toString());
    window.history.pushState(null, "", `?${params.toString()}`);
  };

  const goToNextPage = () => handlePageChange(currentPage + 1);
  const goToPreviousPage = () => handlePageChange(Math.max(1, currentPage - 1));

  return (
    <div className="flex-1 container mx-auto p-4 overflow-auto">
      <h1 className="text-2xl font-bold mb-4">Top Anime</h1>
      {animeList.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 mb-4">
          {animeList.map((anime: Anime) => (
            <AnimeCard
              key={anime.id}
              anime={anime}
              onSelect={setSelectedAnime}
            />
          ))}
        </div>
      ) : (
        <p>No anime data available.</p>
      )}
      <div className="flex justify-between mt-4 pb-4">
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

      <AnimeDialog
        anime={selectedAnime}
        onOpenChange={(open) => {
          if (!open) {
            setSelectedAnime(null);
          }
        }}
      />
    </div>
  );
};
