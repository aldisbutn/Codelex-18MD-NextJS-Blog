export type Post = {
  postID: number;
  userID: number;
  categoryID: number;
  title: string;
  content: string;
  createdAt: string;
  imageURL: string;
};

export type PostComment = {
  commentID: number;
  postID: number;
  author: string;
  content: string;
  createdAt: string;
};

export type Category = {
  categoryID: number;
  categoryName: string;
};

export type User = {
  userID: number;
  username: string;
  password: string;
  email: string;
};
