"use client";
import { useState } from "react";
import PokemonSearchList from "../../../components/PokemonSearchList";
import PokemonModal from "../../../components/PokemonModal";
import { Pokemon } from "../../utils/pokemonData";

export default function Home() {
  const [selectedPokemon, setSelectedPokemon] = useState<Pokemon | null>(null);

  const handlePokemonClick = (pokemon: Pokemon) => {
    setSelectedPokemon(pokemon);
  };

  const handleCloseModal = () => {
    setSelectedPokemon(null);
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">포켓몬 도감</h1>
      <PokemonSearchList onPokemonClick={handlePokemonClick} />
      {selectedPokemon && (
        <PokemonModal pokemon={selectedPokemon} onClose={handleCloseModal} />
      )}
    </div>
  );
}
