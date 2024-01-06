import CreatePost from '@/components/CreatePost/CreatePost';

export const generateMetadata = async () => {
  return {
    title: 'Create post',
  };
};

const createPage = () => {
  return (
    <>
      <CreatePost />
    </>
  );
};

export default createPage;
