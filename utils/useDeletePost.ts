type useDeletePostProps = {
  postID: number;
};

const useDeletePost = async ({ postID }: useDeletePostProps): Promise<boolean> => {
  try {
    const res = await fetch(`http://localhost:3000/api/posts/${postID}`, {
      method: 'DELETE',
    });

    if (res.ok) {
      console.log('Post deleted');
      return true;
    } else {
      console.log('Something went wrong');
      return false;
    }
  } catch (error) {
    console.log(error);
    return false;
  }
};

export default useDeletePost;
