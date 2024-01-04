'use client';

import Style from '@/components/ViewPostsByCategory/ViewPostsByCategory.module.css';
import useGetPosts from '@/utils/useGetPosts';
import useGetComments from '@/utils/useGetComments';
import useGetCategories from '@/utils/useGetCategories';
import { Category, Post, PostComment } from '@/types/types';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from 'react-bootstrap';
import { Session } from 'next-auth';
import { getSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { format, parseISO } from 'date-fns';
import { useEffect, useState } from 'react';

const ViewPostsByCategory = ({ params }: { params: { id: number } }) => {
  const router = useRouter();

  const id = params.id;
  const [posts, setPosts] = useState<Post[]>();
  const [comments, setComments] = useState<PostComment[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [session, setSession] = useState<Session | null>(null);

  // Function to check if user is logged in
  const sessionChecker = async () => {
    const session = await getSession();
    setSession(session);
  };

  // Initial data fetch - set posts, comments and categories and check if user is logged in
  useEffect(() => {
    const fetchData = async () => {
      const posts = await useGetPosts();
      const comments = await useGetComments();
      const categories = await useGetCategories();
      const filteredPosts = posts.filter((post) => String(post.categoryID) === String(id));
      setPosts(filteredPosts);
      setComments(comments);
      setCategories(categories);
      await sessionChecker();
    };
    fetchData();
  }, []);

  // Function to find the number of comments for a post
  const findCommentByIDReturnLength = (id: number) => {
    const commentsWithID = comments.filter((comment) => comment.postID === id);
    return commentsWithID.length;
  };

  // Function to find the category name by ID
  const findCategoryByID = (id: number) => {
    const categoryByID = categories.find((category) => category.categoryID === id);
    return categoryByID?.categoryName;
  };

  // Function to format the date
  const formatDateForPost = (date: string, id: number) => {
    const post = posts!.find((post) => post.postID === id);
    const postDate = parseISO(post!.createdAt);
    return format(postDate, 'dd/MM/yyyy');
  };

  // If posts are not loaded, show loading message
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
          {/* Image display */}
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

          {/* Link that takes to the specific category post view  */}
          <Link href={`/posts/category/${post.categoryID}`} className={Style.categoryButton}>
            {findCategoryByID(post.categoryID)}
          </Link>

          {/* Link that takes to the specific post view */}
          <Link href={`/posts/${post.postID}`} className={Style.postLink}>
            <div className={Style.textWrapper}>
              <h2 className={Style.postTitle}>{post.title}</h2>
              <h4 className={Style.postTitleComments}>({findCommentByIDReturnLength(post.postID)})</h4>
            </div>
          </Link>

          {/* Date display */}
          <h6 className={Style.postDate}>{formatDateForPost(post.createdAt, post.postID)}</h6>

          {/* If user is not logged in, do not show edit button */}
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

export default ViewPostsByCategory;
