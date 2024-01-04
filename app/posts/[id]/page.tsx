import ViewPostAndComments from '@/components/ViewPostAndComments/ViewPostAndComments';

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
