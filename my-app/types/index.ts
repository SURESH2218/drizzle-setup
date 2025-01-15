export interface Post {
  id: string;
  title: string;
  content: string;
  authorId: string;
  createdAt: string;
  updatedAt: string;
  author?: User;
  comments?: Comment[];
}

export interface User {
  id: string;
  email: string;
  username: string;
  fullName?: string;
  profileImage?: string;
}

export interface Comment {
  id: string;
  content: string;
  authorId: string;
  postId: string;
  createdAt: string;
  updatedAt: string;
  author?: User;
}
