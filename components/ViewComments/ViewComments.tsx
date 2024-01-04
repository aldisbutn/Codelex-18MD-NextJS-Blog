'use client';

import { Post, PostComment } from '@/types/types';
import useDeleteComment from '@/utils/useDeleteComment';
import useGetComments from '@/utils/useGetComments';
import useGetPosts from '@/utils/useGetPosts';
import { MouseEvent, useEffect, useState } from 'react';
import Style from '@/components/ViewComments/ViewComments.module.css';
import { getSession } from 'next-auth/react';
import { Button } from 'react-bootstrap';
import { format, parseISO } from 'date-fns';
import Link from 'next/link';
import { toast } from 'react-toastify';
import { useRouter } from 'next/navigation';
import { Session } from 'next-auth';

const ViewComments = () => {
  const [comments, setComments] = useState<PostComment[]>([]);
  const [posts, setPosts] = useState<Post[]>();
  const [session, setSession] = useState<Session | null>(null);
  const router = useRouter();

  const sessionChecker = async () => {
    const session = await getSession();
    if (session === null) {
      router.push(`/api/auth/signin?callbackUrl=/comments`);
    }
    setSession(session);
  };

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

  const findPostByID = (id: number) => {
    const post = posts?.find((post) => post.postID === id);
    return post?.title;
  };

  const formatDateForComment = (date: string) => {
    const commentDate = parseISO(date);
    return format(commentDate, 'dd/MM/yyyy');
  };

  const handleCommentDelete = async (e: MouseEvent<HTMLButtonElement, globalThis.MouseEvent>, commentID: number) => {
    e.preventDefault();
    await useDeleteComment({ commentID });
    const updatedComments = (await useGetComments()) as unknown as PostComment[];
    setComments(updatedComments);
    toast.success('Comment deleted successfully!', {
      theme: 'dark',
    });
  };

  if (!session) {
    return (
      <div className={Style.loadingMessage}>
        <h1>Loading page....</h1>
      </div>
    );
  }

  if (session !== null) {
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
