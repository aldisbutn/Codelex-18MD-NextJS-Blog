type useEditPostProps = {
    postID: number,
    userID: number;
    categoryID: number;
    title: string;
    content: string;
    createdAt: string;
    imageURL: string;
  };
  
  const useEditPost = async ({ postID, userID, categoryID, title, content, createdAt, imageURL }: useEditPostProps) => {
    const submitData = { userID, categoryID, title, content, createdAt, imageURL };
    console.log(submitData)
    try {
      const res = await fetch(`http://localhost:3000/api/posts/${postID}`, {
        method: 'PUT',
        body: JSON.stringify(submitData),
        headers: {
          'content-type': 'application/json',
        },
      });
      console.log(res);
      if (res.ok) {
        console.log('Post posted');
      } else {
        console.log('Something went wrong');
      }
    } catch (error) {
      console.log(error);
    }
  };
  
  export default useEditPost;
  