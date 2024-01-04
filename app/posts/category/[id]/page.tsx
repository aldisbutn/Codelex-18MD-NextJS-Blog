import ViewPostsByCategory from '@/components/ViewPostsByCategory/ViewPostsByCategory';

const PostsByCategory = async ({ params }: { params: { id: number } }) => {
  return (
    <ViewPostsByCategory
      params={{
        id: params.id,
      }}
    />
  );
};

export default PostsByCategory;
