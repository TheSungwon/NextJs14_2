// import { useSession } from "next-auth/react";
import Link from "next/link";

export interface Post {
  _id: string;
  title: string;
  author: {
    id: string;
    email: string;
  };
  createdAt: string;
}

interface PostListProps {
  posts: Post[];
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export default function PostList({
  posts,
  currentPage,
  totalPages,
  onPageChange,
}: PostListProps) {
  // const { data: session } = useSession();

  return (
    <div>
      <table className="w-full border-collapse">
        <thead>
          <tr className="bg-gray-200 text-black">
            <th className="p-2 text-left">제목</th>
            <th className="p-2 text-left">작성자</th>
            <th className="p-2 text-left">작성일</th>
          </tr>
        </thead>
        <tbody>
          {posts.map((post) => (
            <tr key={post._id} className="border-b">
              <td className="p-2">
                <Link href={`/board/${post._id}`}>{post.title}</Link>
              </td>
              <td className="p-2">
                {post?.author?.email ? post?.author?.id : "익명"}
              </td>
              <td className="p-2">
                {new Date(post.createdAt).toLocaleDateString()}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="mt-4 flex justify-center">
        {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
          <button
            key={page}
            onClick={() => onPageChange(page)}
            className={`mx-1 px-3 py-1 rounded ${
              currentPage === page
                ? "bg-blue-500 text-black"
                : "bg-gray-200 text-black"
            }`}
          >
            {page}
          </button>
        ))}
      </div>
    </div>
  );
}
