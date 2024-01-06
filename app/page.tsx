import ViewPosts from '@/components/ViewPosts/ViewPosts';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Home | Aldis Blog'
}

export default function Home() {
  return (
    <>
      <ViewPosts />
    </>
  );
}
