"use client";
import React from "react";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

interface HornBugleItem {
  character_name: string;
  message: string;
  date_send: string;
}

type HornBugleData =
  | HornBugleItem[]
  | { horn_bugle_world_history: HornBugleItem[] };

const fetchHornBugleHistory = async (): Promise<HornBugleData> => {
  const { data } = await axios.get<HornBugleData>(
    "dummy\\mabinogi_api.json"
    // "https://open.api.nexon.com/mabinogi/v1/horn-bugle-world/history?server_name=만돌린"
  );
  return data;
};

export default function Mabinogi() {
  const { data, isLoading, error } = useQuery<HornBugleData, Error>({
    queryKey: ["hornBugleHistory"],
    queryFn: fetchHornBugleHistory,
    retry: 3,
    refetchOnWindowFocus: false,
    staleTime: 60000, // 1분
  });
  console.log(data);
  if (isLoading) return <div>로딩 중...</div>;
  if (error) return <div>에러가 발생했습니다: {error.message}</div>;

  const horn = Array.isArray(data) ? data : data?.horn_bugle_world_history;
  return (
    <div>
      <h1>마비노기 월드 호른버글 히스토리</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 p-4">
        {data &&
          horn?.map((value: HornBugleItem) => (
            <div
              className="flex flex-col w-64 h-48 bg-violet-100 rounded-lg overflow-hidden shadow-md"
              key={value.date_send}
            >
              <div className="bg-violet-600 p-2 text-white">
                {value.date_send}
              </div>
              <div className="bg-violet-500 p-2 text-white">
                {value.character_name}
              </div>
              <div className="bg-violet-400 p-2 text-white flex-grow overflow-auto">
                {value.message}
              </div>
            </div>
          ))}
      </div>
    </div>
  );
}
