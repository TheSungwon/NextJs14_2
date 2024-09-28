import axios from "axios";
import { koreanNames } from "../data/koreanNames";

export interface Pokemon {
  id: number;
  name: string;
  koreanName: string;
  sprites: {
    front_default: string;
    versions: {
      "generation-v": {
        "black-white": {
          animated: {
            front_default: string;
          };
        };
      };
    };
  };
  types: Array<{
    type: {
      name: string;
    };
  }>;
  height: number;
  weight: number;
}

let allPokemons: Pokemon[] = [];

export async function fetchAllPokemons(): Promise<Pokemon[]> {
  if (allPokemons.length > 0) return allPokemons;

  try {
    const response = await axios.get(
      "https://pokeapi.co/api/v2/pokemon?limit=151"
    );
    const results = response.data.results;
    allPokemons = await Promise.all(
      results.map(async (pokemon: { name: string; url: string }) => {
        const res = await axios.get<Pokemon>(pokemon.url);
        return {
          ...res.data,
          koreanName: koreanNames[res.data.name] || res.data.name,
        };
      })
    );
    return allPokemons;
  } catch (error) {
    console.error("포켓몬 데이터를 가져오는 데 실패했습니다:", error);
    throw error;
  }
}

export function searchPokemons(query: string): Pokemon[] {
  const lowerQuery = query.toLowerCase();
  return allPokemons.filter(
    (pokemon) =>
      pokemon.name.toLowerCase().includes(lowerQuery) ||
      pokemon.koreanName.includes(query)
  );
}

export function getKoreanName(englishName: string): string {
  return koreanNames[englishName.toLowerCase()] || englishName;
}
