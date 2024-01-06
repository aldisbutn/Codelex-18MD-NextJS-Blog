'use client'
import { Button } from "react-bootstrap";
import Style from '@/components/Buttons/DeletePostButton/DeletePostButton.module.css';
import useDeletePost from "@/utils/useDeletePost";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import revalidateTagAction from "@/app/actions";

const DeletePostButton = async({ postID}: { postID: number }) => {
    const router = useRouter();

    const handlePostDelete = async (e: React.MouseEvent<HTMLButtonElement>, postID: number) => {
        e.preventDefault();
        await useDeletePost({ postID });
        toast.success('Post deleted!', {
          theme: 'dark',
        });
        revalidateTagAction('posts')
        router.push(`/`);
      };
      
    return (
        <Button
          className={Style.postDeleteButton}
          variant='outline-danger'
          type='button'
          onClick={(e) => handlePostDelete(e, postID)}
        >
          Delete post
        </Button>
    );
};

export default DeletePostButton;