import ViewComments from '@/components/ViewComments/ViewComments';

export const generateMetadata = async () => {
  return {
    title: 'Comments',
  };
};

const commentsPage = () => {
  return (
    <>
      <ViewComments />
    </>
  );
};

export default commentsPage;
