// Define fetchAnimeData function
export const fetchAnimeData = async (page: number) => {
  const response = await fetch("https://graphql.anilist.co", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
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
      variables: { page, perPage: 10 },
    }),
  });
  const result = await response.json();
  return result.data;
};