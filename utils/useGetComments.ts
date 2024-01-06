const useGetComments = async () => {
  const res = await fetch(`http://localhost:3000/api/comments`, {
    next: {
      tags: ['comments']
    }
  });
  const comments = await res.json();
  return comments;
};

export default useGetComments;
