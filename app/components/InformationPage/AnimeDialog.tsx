import { useSearchParams, useRouter } from "next/navigation";
import * as Dialog from "@radix-ui/react-dialog";
import Image from "next/image";

interface Anime {
  id: number;
  title: {
    romaji: string;
    english: string;
  };
  coverImage: {
    large: string;
  };
  popularity: number;
  averageScore: number;
  description?: string;
  genres?: string[];
  episodes?: number;
  duration?: number;
  season?: string;
  seasonYear?: number;
  studios?: {
    nodes: {
      name: string;
    }[];
  };
}

interface AnimeDialogProps {
  anime: Anime | null;
  onOpenChange: (open: boolean) => void;
}

export const AnimeDialog = ({ anime, onOpenChange }: AnimeDialogProps) => {
  const searchParams = useSearchParams();
  const router = useRouter();

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      const params = new URLSearchParams(searchParams.toString());
      params.delete("animeId");
      router.push(`?${params.toString()}`);
    }
    onOpenChange(open);
  };

  const handleCloseClick = () => {
    const params = new URLSearchParams(searchParams.toString());
    params.delete("animeId");
    router.push(`?${params.toString()}`);
  };

  return (
    <Dialog.Root open={!!anime} onOpenChange={handleOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/50" />
        <Dialog.Content className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-gray-900 p-6 rounded-lg shadow-lg border max-w-2xl w-full max-h-[80vh] overflow-y-auto">
          {anime && (
            <div className="">
              <Dialog.Title className="text-2xl font-bold mb-4">
                {anime.title.english || anime.title.romaji}
              </Dialog.Title>
              <div className="flex flex-col md:flex-row gap-4">
                <Image
                  src={anime.coverImage.large}
                  alt={anime.title.romaji || anime.title.english}
                  width={300}
                  height={400}
                  className="w-full md:w-48 h-64 object-cover"
                />
                <div className="flex-1">
                  <p className="mb-2">
                    <strong>Description:</strong>{" "}
                    {anime.description?.replace(/<[^>]*>/g, "") || "No description available"}
                  </p>
                  <p className="mb-2">
                    <strong>Genres:</strong>{" "}
                    {anime.genres?.join(", ") || "N/A"}
                  </p>
                  <p className="mb-2">
                    <strong>Episodes:</strong>{" "}
                    {anime.episodes || "N/A"}
                  </p>
                  <p className="mb-2">
                    <strong>Duration:</strong> {anime.duration}{" "}
                    minutes per episode
                  </p>
                  <p className="mb-2">
                    <strong>Season:</strong> {anime.season}{" "}
                    {anime.seasonYear}
                  </p>
                  <p className="mb-2">
                    <strong>Studio:</strong>{" "}
                    {anime.studios?.nodes?.[0]?.name || "N/A"}
                  </p>
                  <p className="mb-2">
                    <strong>Popularity:</strong> {anime.popularity}
                  </p>
                  <p className="mb-2">
                    <strong>Average Score:</strong>{" "}
                    {anime.averageScore}%
                  </p>
                </div>
              </div>
              <Dialog.Close
                className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                onClick={handleCloseClick}
              >
                Close
              </Dialog.Close>
            </div>
          )}
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
};