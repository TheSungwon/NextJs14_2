import React from "react";
import Image from "next/image";

interface Pokemon {
  id: number;
  name: string;
  sprites: {
    front_default: string;
  };
}

interface PokemonListProps {
  pokemons: Pokemon[];
  onPokemonClick: (pokemon: Pokemon) => void;
}

const PokemonList: React.FC<PokemonListProps> = ({
  pokemons,
  onPokemonClick,
}) => {
  return (
    <ul className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {pokemons.map((pokemon) => (
        <li
          key={pokemon.id}
          className="border p-4 rounded shadow cursor-pointer hover:bg-yellow-200 hover:text-black"
          onClick={() => onPokemonClick(pokemon)}
        >
          <Image
            src={pokemon.sprites.front_default}
            alt={pokemon.name}
            width={96}
            height={96}
            className="mx-auto mb-2"
          />
          <p className="text-center capitalize">{pokemon.name}</p>
        </li>
      ))}
    </ul>
  );
};

export default PokemonList;
