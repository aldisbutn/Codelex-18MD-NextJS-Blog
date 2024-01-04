
import { getServerSession } from 'next-auth/next';
import { redirect } from 'next/navigation';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import EditPost from '@/components/EditPost/EditPost';

const editPage = async ({ params }: { params: { id: number } }) => {
  const session = await getServerSession(authOptions);
  if (!session) {
    redirect('/api/auth/signin?callbackUrl=/posts/create');
  }
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
