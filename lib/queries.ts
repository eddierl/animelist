import { gql } from '@apollo/client';

export const GET_TOP_ANIME = gql`
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
`;