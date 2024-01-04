type useDeleteCommentProps = {
  commentID: number;
};

const useDeleteComment = async ({ commentID }: useDeleteCommentProps) => {
  try {
    const res = await fetch(`http://localhost:3000/api/comments/${commentID}`, {
      method: 'DELETE',
    });
    if (res.ok) {
      console.log('Comment deleted');
    } else {
      console.log('Something went wrong');
    }
  } catch (error) {
    console.log(error);
  }
};

export default useDeleteComment;
