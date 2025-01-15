import { create } from "zustand";
import api from "@/lib/axios";
import { Post } from "@/types";

interface PostStore {
  posts: Post[];
  loading: boolean;
  error: string | null;
  fetchPosts: () => Promise<void>;
  createPost: (title: string, content: string) => Promise<void>;
  updatePost: (id: string, title: string, content: string) => Promise<void>;
  deletePost: (id: string) => Promise<void>;
}

export const usePostStore = create<PostStore>((set) => ({
  posts: [],
  loading: false,
  error: null,

  fetchPosts: async () => {
    set({ loading: true });
    try {
      const { data } = await api.get("/posts");
      set({ posts: data.data, error: null });
    } catch (error) {
      set({ error: "Failed to fetch posts" });
    } finally {
      set({ loading: false });
    }
  },

  createPost: async (title: string, content: string) => {
    set({ loading: true });
    try {
      const { data } = await api.post("/posts", { title, content });
      set((state) => ({
        posts: [data.data, ...state.posts],
        error: null,
      }));
    } catch (error) {
      set({ error: "Failed to create post" });
    } finally {
      set({ loading: false });
    }
  },

  updatePost: async (id: string, title: string, content: string) => {
    set({ loading: true });
    try {
      const { data } = await api.put(`/posts/${id}`, { title, content });
      set((state) => ({
        posts: state.posts.map((post) => (post.id === id ? data.data : post)),
        error: null,
      }));
    } catch (error) {
      set({ error: "Failed to update post" });
    } finally {
      set({ loading: false });
    }
  },

  deletePost: async (id: string) => {
    set({ loading: true });
    try {
      await api.delete(`/posts/${id}`);
      set((state) => ({
        posts: state.posts.filter((post) => post.id !== id),
        error: null,
      }));
    } catch (error) {
      set({ error: "Failed to delete post" });
    } finally {
      set({ loading: false });
    }
  },
}));
