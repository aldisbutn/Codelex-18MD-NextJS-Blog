const useGetPostByID = async (id: number) => {
  const res = await fetch(`http://localhost:3000/api/posts/${id}`, {
    next: {
      revalidate: 60,
    },
  });
  const post = await res.json();
  return post;
};

export default useGetPostByID;
