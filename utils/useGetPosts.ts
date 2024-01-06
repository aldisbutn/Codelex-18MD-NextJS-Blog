import { Post } from '../types/types';

const useGetPosts = async () => {
  const res = await fetch('http://localhost:3000/api/posts/', {
    next: {
      tags: ['posts']
    }
  });
  const data = await res.json();
  return data.posts as Post[];
};

export default useGetPosts;
