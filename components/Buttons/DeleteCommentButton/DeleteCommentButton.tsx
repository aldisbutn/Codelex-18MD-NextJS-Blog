'use client';

import { Button } from 'react-bootstrap';
import Style from './DeleteCommentButton.module.css';
import useDeleteComment from '@/utils/useDeleteComment';
import { toast } from 'react-toastify';
import { useRouter } from 'next/navigation';

const DeleteCommentButton = async({ commentID }: { commentID: number }) => {
  const router = useRouter();

  const handleCommentDelete = async (e: React.MouseEvent<HTMLButtonElement>, commentID: number) => {
    e.preventDefault();
    await useDeleteComment({ commentID });
    toast.success('Comment deleted!', {
      theme: 'dark',
    });
    router.refresh()
  };

  return (
    <Button
      variant='outline-danger'
      className={Style.commentDeleteButton}
      size='sm'
      type='button'
      onClick={(e) => handleCommentDelete(e, commentID)}
    >
      Delete comment
    </Button>
  );
};

export default DeleteCommentButton;
