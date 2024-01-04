'use client';

import Style from '@/components/ViewPostAndComments/ViewPostAndComments.module.css';
import usePostComment from '@/utils/usePostComment';
import useDeleteComment from '@/utils/useDeleteComment';
import useDeletePost from '@/utils/useDeletePost';
import useGetCategoriesByID from '@/utils/useGetCategoriesByID';
import useGetCommentsByID from '@/utils/useGetCommentsByID';
import useGetPostByID from '@/utils/useGetPostByID';
import { Category, Post, PostComment } from '@/types/types';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from 'react-bootstrap';
import { toast } from 'react-toastify';
import { getSession } from 'next-auth/react';
import { Session } from 'next-auth';
import { useRouter } from 'next/navigation';
import { format, parseISO } from 'date-fns';
import { FormEvent, useEffect, useState } from 'react';
import { MouseEvent } from 'react';

const ViewPostAndComments = ({ params }: { params: { id: number } }) => {
  const router = useRouter();
  const postID = params.id;
  const [session, setSession] = useState<Session | null>(null);

  // State variables for post
  const [post, setPost] = useState<Post>();
  const [category, setCategory] = useState<Category>();
  const [comments, setComments] = useState<PostComment[]>([]);

  // State variables for comment
  const [author, setAuthor] = useState('');
  const [content, setContent] = useState('');
  const [posting, setPosting] = useState(false);
  const createdAt = new Date().toISOString();

  // Function to check if user is logged in
  const sessionChecker = async () => {
    const session = await getSession();
    setSession(session);
  };

  // Initial data fetch - set post, category and comments and check if user is logged in
  useEffect(() => {
    const fetchData = async () => {
      const fetchedPost = await useGetPostByID(postID);
      const categoryID = fetchedPost.categoryID;
      const fetchedCategory = await useGetCategoriesByID(categoryID);
      const fetchedComments = (await useGetCommentsByID(postID)) as PostComment[];
      setPost(fetchedPost);
      setCategory(fetchedCategory);
      setComments(fetchedComments);
      await sessionChecker();
    };
    fetchData();
  }, []);

  //Handle post delete - prevent default, delete post, redirect to home page and show toast
  const handlePostDelete = async (e: MouseEvent<HTMLButtonElement, globalThis.MouseEvent>, postID: number) => {
    e.preventDefault();
    await useDeletePost({ postID });
    toast.success('Post deleted!', {
      theme: 'dark',
    });
    router.push('/');
  };

  // Handle comment delete - prevent default, delete comment, update comments and show toast
  const handleCommentDelete = async (e: MouseEvent<HTMLButtonElement, globalThis.MouseEvent>, commentID: number) => {
    e.preventDefault();
    await useDeleteComment({ commentID });
    const updatedComments = (await useGetCommentsByID(postID)) as PostComment[];
    setComments(updatedComments);
    toast.success('Comment deleted!', {
      theme: 'dark',
    });
  };

  // Handle post comment - prevent default, post comment, update comments, clear forms and show toast
  const handlePostComment = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!posting) {
      setPosting(true);
      await usePostComment({ postID, author, content, createdAt });
      setAuthor('');
      setContent('');
      const updatedComments = (await useGetCommentsByID(postID)) as PostComment[];
      setComments(updatedComments);
      toast.success('Comment posted!', {
        theme: 'dark',
      });
    }
    setPosting(false);
  };

  // Function to format the date for post
  const formatDateForPost = () => {
    const postDate = parseISO(post!.createdAt);
    return format(postDate, 'do MMMM yyyy - h:m');
  };

  // Function to format the date for comment
  const formatDateForComment = (date: string) => {
    const commentDate = parseISO(date);
    return format(commentDate, 'dd/MM/yyyy');
  };

  // If post or category are not loaded, show loading message
  if (!post || !category) {
    return (
      <div className={Style.loadingMessage}>
        <h1>Loading page....</h1>
      </div>
    );
  }

  return (
    <div className={Style.postWrapper}>

      {/* If user is not logged in do not show delete post button */}
      {session === null ? (
        <></>
      ) : (
        <Button
          className={Style.postDeleteButton}
          variant='outline-danger'
          type='button'
          onClick={(e) => handlePostDelete(e, postID)}
        >
          Delete post
        </Button>
      )}

      {/* Post display */}
      <h1 className={Style.postTitle}>{post.title}</h1>
      <Image src={post.imageURL} alt={post.title} width={'1025'} height={'500'} priority={true} />
      <div className={Style.postBottom}>
        <div className={Style.postContent} dangerouslySetInnerHTML={{ __html: post.content }} />
        <hr />
        <div className={Style.postInfoWrapper}>
          <Link href={`category/${post.categoryID}`} className={Style.postInfo}>
            <h6 className={Style.postInfo}>Category: {category.categoryName}</h6>
          </Link>
          <h6 className={Style.postInfo}> Post Created on the {formatDateForPost()}</h6>
        </div>
        <hr />

        {/* Comment display */}
        <div className={Style.postCommentsWrapper}>
          <h3>Comments</h3>
          {/* If there are comments display them, otherwise show no comments message */}
          {comments.length < 0 ? (
            comments.map((comment) => (
              <div key={comment.commentID} className={Style.postCommentWrapper}>
                <hr />
                <div className={Style.postCommentInfoWrapper}>
                  <h5>Author: {comment.author}</h5>
                  <h6>Posted at: {formatDateForComment(comment.createdAt)}</h6>
                </div>
                <h4 className={Style.postCommentContent}>{comment.content}</h4>

                {/* If user is not logged in do not show delete comment button */}
                {session === null ? (
                  <></>
                ) : (
                  <Button
                    variant='outline-danger'
                    className={Style.commentDeleteButton}
                    size='sm'
                    type='button'
                    onClick={(e) => handleCommentDelete(e, comment.commentID)}
                  >
                    Delete comment
                  </Button>
                )}
              </div>
            ))
          ) : (
            <p>No comments yet.</p>
          )}

          {/* Add comment form */}
          <div>
            <hr />
            <form className={Style.addCommentForm} name='comment' onSubmit={(e) => handlePostComment(e)}>
              <input
                type='text'
                className={Style.addCommentInput}
                name='comment_author'
                placeholder='Name'
                value={author}
                onChange={(e) => setAuthor(e.target.value)}
                required
              />
              <textarea
                className={Style.addCommentTextArea}
                name='comment_content'
                placeholder='Comment...'
                value={content}
                onChange={(e) => setContent(e.target.value)}
                required
              />
              <Button className={Style.addCommentButton} variant='outline-success' type='submit' disabled={posting}>
                Add comment
              </Button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewPostAndComments;
