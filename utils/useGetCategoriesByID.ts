import { Category } from '../types/types';

const useGetCategoriesByID = async (id: number) => {
  const catRes = await fetch(`http://localhost:3000/api/categories/${id}`);
  const category = await catRes.json();
  return category[0] as Category;
};

export default useGetCategoriesByID;
