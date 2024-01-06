const useGetCommentsByID = async (id: number) => {
  const res = await fetch(`http://localhost:3000/api/comments/${id}`, {
    next: {
      tags: ['comments'],
    },
  });
  const comments = await res.json();
  return comments;
};

export default useGetCommentsByID;
