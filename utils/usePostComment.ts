type usePostCommentProps = {
  postID: number;
  author: string;
  content: string;
  createdAt: string;
};

const usePostComment = async ({ postID, author, content, createdAt }: usePostCommentProps) => {
  const submitData = { postID, author, content, createdAt };
  try {
    const res = await fetch('http://localhost:3000/api/comments/', {
      method: 'POST',
      body: JSON.stringify(submitData),
      headers: {
        'content-type': 'application/json',
      },
    });
    console.log(res);
    if (res.ok) {
      console.log('Comment posted');
    } else {
      console.log('Something went wrong');
    }
  } catch (error) {
    console.log(error);
  }
};

export default usePostComment;
