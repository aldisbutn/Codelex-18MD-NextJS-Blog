'use client';

import Style from '@/components/AddComment/AddComment.module.css';
import { Button } from 'react-bootstrap';
import { FormEvent, useState } from 'react';
import usePostComment from '@/utils/usePostComment';
import { toast } from 'react-toastify';
import revalidateTagAction from '@/app/actions';

const AddComment =  ({ postID }: { postID: number }) => {
  const [author, setAuthor] = useState('');
  const [content, setContent] = useState('');
  const [posting, setPosting] = useState(false);
  const createdAt = new Date().toISOString();

  // Handle post submission - prevent default, submit post, clear form, revalidate comments(refetch) and show toast
  const handlePostComment = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!posting) {
      setPosting(true);
      await usePostComment({ postID, author, content, createdAt });
      setAuthor('');
      setContent('');
      revalidateTagAction('comments');
      toast.success('Comment posted!', {
        theme: 'dark',
      });
    }
    setPosting(false);
  };

  return (
    <>
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
    </>
  );
};

export default AddComment;
