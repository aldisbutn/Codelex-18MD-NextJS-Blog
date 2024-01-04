'use client';

import Style from '@/components/ViewComments/ViewComments.module.css';
import useDeleteComment from '@/utils/useDeleteComment';
import useGetComments from '@/utils/useGetComments';
import useGetPosts from '@/utils/useGetPosts';
import { Post, PostComment } from '@/types/types';
import Link from 'next/link';
import { toast } from 'react-toastify';
import { Button } from 'react-bootstrap';
import { MouseEvent, useEffect, useState } from 'react';
import { getSession } from 'next-auth/react';
import { Session } from 'next-auth';
import { useRouter } from 'next/navigation';
import { format, parseISO } from 'date-fns';

const ViewComments = () => {
  const router = useRouter();

  const [comments, setComments] = useState<PostComment[]>([]);
  const [posts, setPosts] = useState<Post[]>();
  const [session, setSession] = useState<Session | null>(null);

  // Function to check if user is logged in, if not redirect to sign in page
  const sessionChecker = async () => {
    const session = await getSession();
    if (session === null) {
      router.push(`/api/auth/signin?callbackUrl=/comments`);
    }
    setSession(session);
  };

  // Initial data fetch - set comments and posts and check if user is logged in
  useEffect(() => {
    const fetchData = async () => {
      const posts = await useGetPosts();
      const comments = await useGetComments();
      setPosts(posts);
      setComments(comments);
      await sessionChecker();
    };
    fetchData();
  }, []);

  // Function to find the post title by ID
  const findPostByID = (id: number) => {
    const post = posts?.find((post) => post.postID === id);
    return post?.title;
  };

  // Function to format the date
  const formatDateForComment = (date: string) => {
    const commentDate = parseISO(date);
    return format(commentDate, 'dd/MM/yyyy');
  };

  // Handle comment delete - prevent default, delete comment, update comments and show toast
  const handleCommentDelete = async (e: MouseEvent<HTMLButtonElement, globalThis.MouseEvent>, commentID: number) => {
    e.preventDefault();
    await useDeleteComment({ commentID });
    const updatedComments = (await useGetComments()) as unknown as PostComment[];
    setComments(updatedComments);
    toast.success('Comment deleted successfully!', {
      theme: 'dark',
    });
  };

  // If session is null, show loading message till it redirects to sign in page
  if (!session) {
    return (
      <div className={Style.loadingMessage}>
        <h1>Loading page....</h1>
      </div>
    );
  }

  // If user is logged in show all comments with delete button
  if (session) {
    return (
      <div className={Style.commentsWrapper}>
        {comments.length > 0 ? (
          comments.map((comment) => (
            <div key={comment.commentID} className={Style.commentWrapper}>
              <div className={Style.commentInfoWrapper}>
                <h5>Author: {comment.author}</h5>
                <h6>Posted at: {formatDateForComment(comment.createdAt)}</h6>
              </div>
              <h4 className={Style.commentContent}>{comment.content}</h4>
              <Link href={`/posts/${comment.postID}`} className={Style.postLink}>
                <h6>{findPostByID(comment.postID)}</h6>
              </Link>
              <Button
                variant='outline-danger'
                className={Style.commentDeleteButton}
                size='sm'
                type='button'
                onClick={(e) => handleCommentDelete(e, comment.commentID)}
              >
                Delete comment
              </Button>
              <hr />
            </div>
          ))
        ) : (
          <p>No comments yet.</p>
        )}
      </div>
    );
  }
};

export default ViewComments;
