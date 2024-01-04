'use client';

import { useEffect, useState } from 'react';
import { Category, Post, PostComment } from '@/types/types';
import useGetPosts from '@/utils/useGetPosts';
import Link from 'next/link';
import { getSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import useGetComments from '@/utils/useGetComments';
import Style from '@/components/ViewPosts/ViewPosts.module.css';
import Image from 'next/image';
import useGetCategories from '@/utils/useGetCategories';
import { Button } from 'react-bootstrap';
import { parseISO, format } from 'date-fns';
import { Session } from 'next-auth';

const ViewPosts = () => {
  const [posts, setPosts] = useState<Post[]>();
  const [comments, setComments] = useState<PostComment[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [session, setSession] = useState<Session | null>(null);
  const router = useRouter();

  const sessionChecker = async () => {
    const session = await getSession();
    setSession(session);
  };

  useEffect(() => {
    const fetchData = async () => {
      const posts = await useGetPosts();
      const comments = await useGetComments();
      const categories = await useGetCategories();
      setPosts(posts);
      setComments(comments);
      setCategories(categories);
      sessionChecker()
    };

    fetchData();
  }, []);

  const findCommentByIDReturnLength = (id: number) => {
    const commentsWithID = comments.filter((comment) => comment.postID === id);
    return commentsWithID.length;
  };

  const findCategoryByID = (id: number) => {
    const categoryByID = categories.find((category) => category.categoryID === id);
    return categoryByID?.categoryName;
  };

  const formatDateForPost = (date: string, id: number) => {
    const post = posts!.find((post) => post.postID === id);
    const postDate = parseISO(post!.createdAt);
    return format(postDate, 'dd/MM/yyyy');
  };

  if (!posts) {
    return (
      <div className={Style.loadingMessage}>
        <h1>Loading page....</h1>
      </div>
    );
  }

  return (
    <section className={Style.postsSection}>
      {posts.map((post) => (
        <div className={Style.postWrapper} key={post.postID}>
          <Image
            src={post.imageURL}
            alt={post.title}
            width={0}
            height={0}
            sizes='100vw'
            style={{ width: '100%', height: 'auto' }}
            priority={true}
            className={Style.postImage}
          />
          <Link href={`/posts/category/${post.categoryID}`} className={Style.categoryButton}>
            {findCategoryByID(post.categoryID)}
          </Link>
          <Link href={`/posts/${post.postID}`} className={Style.postLink}>
            <div className={Style.textWrapper}>
              <h2 className={Style.postTitle}>{post.title}</h2>
              <h4 className={Style.postTitleComments}>({findCommentByIDReturnLength(post.postID)})</h4>
            </div>
          </Link>

          <h6 className={Style.postDate}>{formatDateForPost(post.createdAt, post.postID)}</h6>
          {session === null ? (
            <></>
          ) : (
            <Button
              variant='outline-light'
              className={Style.editButton}
              type='button'
              onClick={() => router.push(`/posts/edit/${post.postID}`, { scroll: false })}
            >
              Edit post
            </Button>
          )}
        </div>
      ))}
    </section>
  );
};

export default ViewPosts;
