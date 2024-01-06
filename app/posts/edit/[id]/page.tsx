import EditPost from '@/components/EditPost/EditPost';
import useGetPostByID from '@/utils/useGetPostByID';

export const generateMetadata = async ({ params }: { params: { id: number } }) => {
  const res = await fetch(`http://localhost:3000/api/posts/${params.id}`);
  const post = await res.json();
  return {
    title: `Edit post | ${post.title}`,
  };
};

const editPage = ({ params }: { params: { id: number } }) => {
  useGetPostByID(params.id);
  return (
    <>
      <EditPost
        params={{
          id: params.id,
        }}
      />
    </>
  );
};

export default editPage;
