import ViewPostsByCategory from '@/components/ViewPostsByCategory/ViewPostsByCategory';

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
