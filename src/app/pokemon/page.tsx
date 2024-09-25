"use client";
import { useState, useEffect } from "react";
import axios from "axios";
import PokemonList from "../../../components/PokemonList";
import PokemonSearch from "../../../components/PokemonSearch";
import LoadingSpinner from "../../../components/LoadingSpinner";
import PokemonModal from "../../../components/PokemonModal";

interface Pokemon {
  id: number;
  name: string;
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

export default function Home() {
  const [pokemons, setPokemons] = useState<Pokemon[]>([]);
  const [selectedPokemon, setSelectedPokemon] = useState<Pokemon | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchAllPokemons();
  }, []);

  const fetchAllPokemons = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        "https://pokeapi.co/api/v2/pokemon?limit=151"
      );
      const results = response.data.results;
      const pokemonData = await Promise.all(
        results.map(async (pokemon: { name: string; url: string }) => {
          const res = await axios.get<Pokemon>(pokemon.url);
          return res.data;
        })
      );
      setPokemons(pokemonData);
      setError(null);
    } catch (error) {
      setError("포켓몬 목록을 가져오는 데 실패했습니다. 다시 시도해주세요.");
    } finally {
      setLoading(false);
    }
  };

  const handlePokemonClick = (pokemon: Pokemon) => {
    setSelectedPokemon(pokemon);
  };

  const handleCloseModal = () => {
    setSelectedPokemon(null);
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">포켓몬 도감</h1>
      <PokemonSearch setSearchResult={setSelectedPokemon} setError={setError} />
      {error && <p className="text-red-500 mb-4">{error}</p>}
      {loading ? (
        <LoadingSpinner />
      ) : (
        <PokemonList pokemons={pokemons} onPokemonClick={handlePokemonClick} />
      )}
      {selectedPokemon && (
        <PokemonModal pokemon={selectedPokemon} onClose={handleCloseModal} />
      )}
    </div>
  );
}
