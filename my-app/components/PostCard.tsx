// components/PostCard.tsx
import Image from "next/image";
import { Post } from "@/types";
import { useUser } from "@clerk/nextjs";
import { usePostStore } from "@/store/usePostStore";

interface PostCardProps {
  post: Post;
}

export const PostCard = ({ post }: PostCardProps) => {
  const { user } = useUser();
  const deletePost = usePostStore((state) => state.deletePost);
  const isAuthor = user?.id === post.authorId;

  const handleDelete = async () => {
    if (window.confirm("Are you sure you want to delete this post?")) {
      await deletePost(post.id);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-4">
      <h2 className="text-xl font-bold mb-2">{post.title}</h2>
      <p className="text-gray-600 mb-4">{post.content}</p>
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Image
            src={
              post.author?.profileImage ||
              "https://images.pexels.com/photos/326055/pexels-photo-326055.jpeg?auto=compress&cs=tinysrgb&w=600"
            }
            alt={post.author?.username || "image"}
            width={300} // Adjust as needed
            height={300} // Adjust as needed
            className="rounded-md"
          />
          <span className="text-sm text-gray-500">{post.author?.username}</span>
        </div>
        {isAuthor && (
          <div className="space-x-2">
            <button
              onClick={handleDelete}
              className="text-red-500 hover:text-red-600"
            >
              Delete
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
