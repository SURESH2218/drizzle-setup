"use client";

import { useEffect } from "react";
import { useUser } from "@clerk/nextjs";
import { usePostStore } from "@/store/usePostStore";
import { PostCard } from "@/components/PostCard";
import { CreatePostForm } from "@/components/CreatePostForm";
import Link from "next/link";
import { LoadingSpinner } from "@/components/LoadingSpinner";

export default function Home() {
  const { isSignedIn, isLoaded } = useUser();
  const { posts, loading, error, fetchPosts } = usePostStore();

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  if (!isLoaded || loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <LoadingSpinner />
      </div>
    );
  }

  // if (error) {
  //   return (
  //     <div className="container mx-auto px-4 py-8">
  //       <div className="bg-red-50 text-red-600 p-4 rounded-md">
  //         Error: {error}
  //       </div>
  //     </div>
  //   );
  // }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Recent Posts</h1>
        {!isSignedIn && (
          <p className="mt-2 text-gray-600">
            <Link
              href="/sign-in"
              className="text-indigo-600 hover:text-indigo-700"
            >
              Sign in
            </Link>{" "}
            to create your own posts and join the conversation.
          </p>
        )}
      </div>

      {isSignedIn && <CreatePostForm />}

      {posts.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          No posts yet. Be the first to create one!
        </div>
      ) : (
        <div className="space-y-6">
          {posts.map((post) => (
            <PostCard key={post.id} post={post} />
          ))}
        </div>
      )}
    </div>
  );
}
