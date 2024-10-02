"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Post } from "../../../components/PostList";
import LoadingSpinner from "../../../components/LoadingSpinner";

export default function AdminPage() {
  const [posts, setPosts] = useState([]);
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "loading") return;
    if (!session || session.user.role !== "admin") {
      router.push("/");
    } else {
      fetchPosts();
    }
  }, [router, session, status]);

  const fetchPosts = async () => {
    const res = await fetch("/api/admin/posts");
    const data = await res.json();
    setPosts(data.posts);
  };

  const handleDelete = async (postId: string) => {
    const res = await fetch(`/api/admin/posts/${postId}`, {
      method: "DELETE",
    });
    if (res.ok) {
      fetchPosts();
    } else {
      alert("게시글 삭제에 실패했습니다.");
    }
  };

  if (status === "loading") {
    return <LoadingSpinner />;
  }

  if (!session || session.user.role !== "admin") {
    return null;
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">관리자 페이지</h1>
      <table className="w-full border-collapse">
        <thead>
          <tr className="bg-gray-200">
            <th className="p-2 text-left">제목</th>
            <th className="p-2 text-left">작성자</th>
            <th className="p-2 text-left">작성일</th>
            <th className="p-2 text-left">관리</th>
          </tr>
        </thead>
        <tbody>
          {posts.map((post: Post) => (
            <tr key={post._id} className="border-b">
              <td className="p-2">{post.title}</td>
              <td className="p-2">{post.author.email}</td>
              <td className="p-2">
                {new Date(post.createdAt).toLocaleDateString()}
              </td>
              <td className="p-2">
                <button
                  onClick={() => handleDelete(post._id)}
                  className="bg-red-500 text-white px-2 py-1 rounded"
                >
                  삭제
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
