"use client";

import { useState, useEffect, useCallback } from "react";
import { useSession } from "next-auth/react";
import PostList from "../../../components/PostList";
import PostForm from "../../../components/PostForm";

export default function BoardPage() {
  const [posts, setPosts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const { data: session } = useSession();

  const fetchPosts = useCallback(async () => {
    const res = await fetch(`/api/posts?page=${currentPage}&limit=10`);
    console.log(res);
    const data = await res.json();
    setPosts(data.posts);
    setTotalPages(data.totalPages);
  }, [currentPage]);

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts, currentPage]);

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">게시판</h1>
      {session && <PostForm onPostCreated={fetchPosts} />}
      <PostList
        posts={posts}
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
      />
    </div>
  );
}
