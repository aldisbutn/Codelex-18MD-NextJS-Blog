import EditPost from '@/components/EditPost/EditPost';

const editPage = ({ params }: { params: { id: number } }) => {
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
