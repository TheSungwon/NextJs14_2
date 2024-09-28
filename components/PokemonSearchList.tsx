import React, { useState, useEffect } from "react";
import Image from "next/image";
import {
  Pokemon,
  searchPokemons,
  fetchAllPokemons,
} from "../src/utils/pokemonData";
import useDebounce from "../src/hooks/useDebounce";
import LoadingSpinner from "./LoadingSpinner";

interface PokemonSearchListProps {
  onPokemonClick: (pokemon: Pokemon) => void;
}

const PokemonSearchList = ({ onPokemonClick }: PokemonSearchListProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [pokemons, setPokemons] = useState<Pokemon[]>([]);
  const [displayedPokemons, setDisplayedPokemons] = useState<Pokemon[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const debouncedSearchTerm = useDebounce(searchTerm, 300);

  useEffect(() => {
    fetchAllPokemons()
      .then((data) => {
        setPokemons(data);
        setDisplayedPokemons(data);
        setLoading(false);
      })
      .catch((error) => {
        setError(
          "포켓몬 목록을 가져오는 데 실패했습니다. 다시 시도해주세요." + error
        );
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    if (!debouncedSearchTerm.trim()) {
      setDisplayedPokemons(pokemons);
      setError(null);
      return;
    }

    const results = searchPokemons(debouncedSearchTerm);
    setDisplayedPokemons(results);

    if (results.length === 0) {
      setError("포켓몬을 찾을 수 없습니다. 다시 확인해주세요.");
    } else {
      setError(null);
    }
  }, [debouncedSearchTerm, pokemons]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div>
      <div className="mb-4">
        <input
          type="text"
          value={searchTerm}
          onChange={handleSearchChange}
          placeholder="포켓몬 이름 검색 (한글 또는 영어)"
          className="border p-2 rounded w-full"
        />
      </div>

      {error && <p className="text-red-500 mb-4">{error}</p>}

      <ul className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {displayedPokemons.map((pokemon) => (
          <li
            key={pokemon.id}
            className="border p-4 rounded shadow cursor-pointer hover:bg-yellow-200 hover:text-black"
            onClick={() => onPokemonClick(pokemon)}
          >
            <Image
              src={pokemon.sprites.front_default}
              alt={pokemon.koreanName}
              width={96}
              height={96}
              className="mx-auto mb-2"
            />
            <p className="text-center capitalize">{pokemon.koreanName}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default PokemonSearchList;
