import React, { useRef, useEffect } from "react";
import Image from "next/image";
import { getKoreanName } from "@/utils/pokemonData";

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

interface PokemonModalProps {
  pokemon: Pokemon;
  onClose: () => void;
}

const PokemonModal: React.FC<PokemonModalProps> = ({ pokemon, onClose }) => {
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    playSound();
  }, []);

  const playSound = () => {
    if (audioRef.current) {
      audioRef.current.src = `https://play.pokemonshowdown.com/audio/cries/${pokemon.name.toLowerCase()}.mp3`;
      audioRef.current
        .play()
        .catch((e) => console.error("오디오 재생 실패:", e));
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50"
      onClick={onClose}
    >
      <div
        className="bg-white p-6 rounded-lg max-w-md w-full"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-2xl font-bold mb-4 capitalize text-black">
          {`ENG : ${pokemon.name} / KOR :  ${getKoreanName(pokemon.name)}`}
        </h2>
        <div className="flex justify-center items-center space-x-4 mb-4 ">
          <Image
            src={pokemon.sprites.front_default}
            alt={pokemon.name}
            width={200}
            height={200}
          />
          <Image
            src={
              pokemon.sprites.versions["generation-v"]["black-white"].animated
                .front_default
            }
            alt={`${pokemon.name} animated`}
            width={96}
            height={96}
          />
        </div>
        <div className="text-black">
          <p className="mb-2">
            타입: {pokemon.types.map((t) => t.type.name).join(", ")}
          </p>
          <p className="mb-2">키: {pokemon.height / 10}m</p>
          <p className="mb-4">몸무게: {pokemon.weight / 10}kg</p>
        </div>
        <div className="flex justify-between">
          <button
            onClick={playSound}
            className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
          >
            울음소리 다시 재생
          </button>
          <button
            onClick={onClose}
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          >
            닫기
          </button>
        </div>
        <audio ref={audioRef} />
      </div>
    </div>
  );
};

export default PokemonModal;
