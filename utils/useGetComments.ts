const useGetComments = async () => {
  const res = await fetch(`http://localhost:3000/api/comments`, {
    next: {
      revalidate: 60,
    },
  });
  const comments = await res.json();
  return comments;
};

export default useGetComments;
