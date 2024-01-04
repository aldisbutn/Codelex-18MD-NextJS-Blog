type useSubmitPostProps = {
  userID: number;
  categoryID: number;
  title: string;
  content: string;
  createdAt: string;
  imageURL: string;
};

const useSubmitPost = async ({ userID, categoryID, title, content, createdAt, imageURL }: useSubmitPostProps) => {
  const submitData = { userID, categoryID, title, content, createdAt, imageURL };
  console.log(submitData);

  try {
    const res = await fetch('http://localhost:3000/api/posts/', {
      method: 'POST',
      body: JSON.stringify(submitData),
      headers: {
        'Content-Type': 'application/json',
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

export default useSubmitPost;
