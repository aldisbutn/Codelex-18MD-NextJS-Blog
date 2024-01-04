'use client';

import { FormEvent, useEffect, useState } from 'react';
import useGetCategoriesByID from '@/utils/useGetCategoriesByID';
import useGetCommentsByID from '@/utils/useGetCommentsByID';
import Link from 'next/link';
import Image from 'next/image';
import useGetPostByID from '@/utils/useGetPostByID';
import { MouseEvent } from 'react';
import useDeletePost from '@/utils/useDeletePost';
import { Category, Post, PostComment } from '@/types/types';
import useDeleteComment from '@/utils/useDeleteComment';
import { useRouter } from 'next/navigation';
import { getSession } from 'next-auth/react';
import usePostComment from '@/utils/usePostComment';
import { Button } from 'react-bootstrap';
import Style from '@/components/ViewPostAndComments/ViewPostAndComments.module.css';
import { format, parseISO } from 'date-fns';
import { toast } from 'react-toastify';
import { Session } from 'next-auth';

const ViewPostAndComments = ({ params }: { params: { id: number } }) => {
  const [post, setPost] = useState<Post>();
  const [category, setCategory] = useState<Category>();
  const [comments, setComments] = useState<PostComment[]>([]);
  const [author, setAuthor] = useState('');
  const [content, setContent] = useState('');
  const [posting, setPosting] = useState(false);
  const createdAt = new Date().toISOString();
  const router = useRouter();
  const postID = params.id;
  const [session, setSession] = useState<Session | null>(null);

  const sessionChecker = async () => {
    const session = await getSession();
    setSession(session);
  };

  useEffect(() => {
    const fetchData = async () => {
      const fetchedPost = await useGetPostByID(postID);
      setPost(fetchedPost);

      const categoryID = fetchedPost.categoryID;
      const fetchedCategory = await useGetCategoriesByID(categoryID);
      setCategory(fetchedCategory);

      const fetchedComments = (await useGetCommentsByID(postID)) as PostComment[];
      setComments(fetchedComments);
      await sessionChecker();
    };

    fetchData();
  }, []);

  const handlePostDelete = async (e: MouseEvent<HTMLButtonElement, globalThis.MouseEvent>, postID: number) => {
    e.preventDefault();
    const result = await useDeletePost({ postID });
    toast.success('Post deleted!', {
      theme: 'dark',
    });

    if (result) {
      router.push('/', { scroll: false });
    }
  };

  const handleCommentDelete = async (e: MouseEvent<HTMLButtonElement, globalThis.MouseEvent>, commentID: number) => {
    e.preventDefault();
    await useDeleteComment({ commentID });
    const updatedComments = (await useGetCommentsByID(postID)) as PostComment[];
    setComments(updatedComments);
    toast.success('Comment deleted!', {
      theme: 'dark',
    });
  };

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

  const formatDateForPost = () => {
    const postDate = parseISO(post!.createdAt);
    return format(postDate, 'do MMMM yyyy - h:m');
  };

  const formatDateForComment = (date: string) => {
    const commentDate = parseISO(date);
    return format(commentDate, 'dd/MM/yyyy');
  };

  if (!post || !category) {
    return (
      <div className={Style.loadingMessage}>
        <h1>Loading page....</h1>
      </div>
    );
  }

  return (
    <div className={Style.postWrapper}>
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
        <div className={Style.postCommentsWrapper}>
          <h3>Comments</h3>

          {comments.length > 0 ? (
            comments.map((comment) => (
              <div key={comment.commentID} className={Style.postCommentWrapper}>
                <hr />
                <div className={Style.postCommentInfoWrapper}>
                  <h5>Author: {comment.author}</h5>
                  <h6>Posted at: {formatDateForComment(comment.createdAt)}</h6>
                </div>

                <h4 className={Style.postCommentContent}>{comment.content}</h4>

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
