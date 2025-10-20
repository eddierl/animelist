import { useSearchParams, useRouter } from "next/navigation";
import Image from "next/image";

export interface Anime {
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
}

interface AnimeCardProps {
  anime: Anime;
  onSelect: (anime: Anime) => void;
}

export const AnimeCard = ({ anime, onSelect }: AnimeCardProps) => {
  const searchParams = useSearchParams();
  const router = useRouter();

  const handleClick = () => {
    onSelect(anime);
    const params = new URLSearchParams(searchParams.toString());
    params.set("animeId", anime.id.toString());
    router.push(`?${params.toString()}`);
  };

  return (
    <div
      className="border rounded-lg p-4 shadow cursor-pointer hover:shadow-lg transition-shadow"
      onClick={handleClick}
    >
      <Image
        src={anime.coverImage.large}
        alt={anime.title.romaji || anime.title.english}
        width={300}
        height={400}
        className="w-full h-48 object-cover mb-2"
      />
      <h2 className="text-lg font-semibold">
        {anime.title.english || anime.title.romaji}
      </h2>
      <p className="text-sm text-gray-400">Popularity: {anime.popularity}</p>
      <p className="text-sm text-gray-400">
        Average Score: {anime.averageScore}%
      </p>
    </div>
  );
};
