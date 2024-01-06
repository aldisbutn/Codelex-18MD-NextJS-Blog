import ViewPostsByCategory from '@/components/ViewPostsByCategory/ViewPostsByCategory';

export const generateMetadata = async ({ params }: { params: { id: number } }) => {
  const res = await fetch(`http://localhost:3000/api/categories/${params.id}`);
  const category = await res.json();
  return {
    title: `${category[0].categoryName}`,
  };
};

const PostsByCategory = ({ params }: { params: { id: number } }) => {
  return (
    <ViewPostsByCategory
      params={{
        id: params.id,
      }}
    />
  );
};

export default PostsByCategory;
