import ViewPostAndComments from '@/components/ViewPostAndComments/ViewPostAndComments';

export const generateMetadata = async ({ params }: { params: { id: number } }) => {
  const res = await fetch(`http://localhost:3000/api/posts/${params.id}`);
  const post = await res.json();
  return {
    title: `${post.title}`,
  };
};

const postPage = ({ params }: { params: { id: number } }) => {
  const postid = Number(params.id);
  return (
    <>
      <ViewPostAndComments
        params={{
          id: postid,
        }}
      />
    </>
  );
};

export default postPage;
