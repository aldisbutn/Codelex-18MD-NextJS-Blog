import { Category } from '../types/types';

const useGetCategories = async () => {
  const catRes = await fetch(`http://localhost:3000/api/categories`, {
    next: {
      tags: ['categories']
    }
  });
  const category = await catRes.json();
  return category as Category[];
};

export default useGetCategories;
