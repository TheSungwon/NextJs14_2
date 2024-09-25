import React, { useState } from "react";
import axios from "axios";
import { koreanToEnglish } from "../src/utils/pokemonNames";

interface Pokemon {
  id: number;
  name: string;
  sprites: {
    front_default: string;
  };
  types: Array<{
    type: {
      name: string;
    };
  }>;
  height: number;
  weight: number;
}

interface PokemonSearchProps {
  setSearchResult: (result: Pokemon | null) => void;
  setError: (error: string | null) => void;
}

const PokemonSearch: React.FC<PokemonSearchProps> = ({
  setSearchResult,
  setError,
}) => {
  const [searchTerm, setSearchTerm] = useState("");

  const handleSearch = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!searchTerm.trim()) {
      setError("포켓몬 이름을 입력해주세요.");
      return;
    }

    try {
      const englishName =
        koreanToEnglish[searchTerm] || searchTerm.toLowerCase();
      const response = await axios.get<Pokemon>(
        `https://pokeapi.co/api/v2/pokemon/${englishName}`
      );
      setSearchResult(response.data);
      setError(null);
    } catch (error) {
      setSearchResult(null);
      setError("포켓몬을 찾을 수 없습니다. 다시 확인해주세요.");
    }
  };

  return (
    <form onSubmit={handleSearch} className="mb-4">
      <input
        type="text"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        placeholder="포켓몬 이름 검색 (한글 또는 영어)"
        className="border p-2 mr-2 rounded"
      />
      <button
        type="submit"
        className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
      >
        검색
      </button>
    </form>
  );
};

export default PokemonSearch;
