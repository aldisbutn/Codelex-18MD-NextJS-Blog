import Style from '@/components/ViewPostAndComments/ViewPostAndComments.module.css';
import useGetCategoriesByID from '@/utils/useGetCategoriesByID';
import useGetCommentsByID from '@/utils/useGetCommentsByID';
import useGetPostByID from '@/utils/useGetPostByID';
import { Category, Post, PostComment } from '@/types/types';
import Link from 'next/link';
import Image from 'next/image';
import { format, parseISO } from 'date-fns';
import AddComment from '../AddComment/AddComment';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { getServerSession } from 'next-auth';
import DeleteCommentButton from '../Buttons/DeleteCommentButton/DeleteCommentButton';
import DeletePostButton from '../Buttons/DeletePostButton/DeletePostButton';

const ViewPostAndComments = async ({ params }: { params: { id: number } }) => {
  const postID = params.id;

  const post = (await useGetPostByID(postID)) as Post;
  const category = (await useGetCategoriesByID(post.categoryID)) as Category;
  const comments = (await useGetCommentsByID(postID)) as PostComment[];
  const session = await getServerSession(authOptions);

  // Function to format the date for post
  const formatDateForPost = () => {
    const postDate = parseISO(post!.createdAt);
    return format(postDate, 'do MMMM yyyy - h:m');
  };

  // Function to format the date for comment
  const formatDateForComment = (date: string) => {
    const commentDate = parseISO(date);
    return format(commentDate, 'dd/MM/yyyy');
  };

  // If post or category are not loaded, show loading message
  if (!post || !category) {
    return (
      <div className={Style.loadingMessage}>
        <h1>Loading page....</h1>
      </div>
    );
  }

  return (
    <div className={Style.postWrapper}>
      {/* If user is not logged in do not show delete post button */}
      {session === null ? <></> : <DeletePostButton postID={post.postID} />}

      {/* Post display */}
      <h1 className={Style.postTitle}>{post.title}</h1>
      <Image src={post.imageURL} alt={post.title} width={'1025'} height={'500'} priority={true} />
      <div className={Style.postBottom}>
        <div className={Style.postContent} dangerouslySetInnerHTML={{ __html: post.content }} />
        <hr />
        <div className={Style.postInfoWrapper}>
          <Link href={`category/${post.categoryID}`} className={Style.postInfo}>
            <h6 className={Style.postInfo}>Category: {category.categoryName}</h6>
          </Link>
          <h6 className={Style.postInfo}> Post Created on the {formatDateForPost()}</h6>
        </div>
        <hr />

        {/* Comment display */}
        <div className={Style.postCommentsWrapper}>
          <h3>Comments</h3>
          {/* If there are comments display them, otherwise show no comments message */}
          {comments.length > 0 ? (
            comments.map((comment) => (
              <div key={comment.commentID} className={Style.postCommentWrapper}>
                <hr />
                <div className={Style.postCommentInfoWrapper}>
                  <h5>Author: {comment.author}</h5>
                  <h6>Posted at: {formatDateForComment(comment.createdAt)}</h6>
                </div>
                <h4 className={Style.postCommentContent}>{comment.content}</h4>

                {/* If user is not logged in do not show delete comment button */}
                {session === null ? <></> : <DeleteCommentButton commentID={comment.commentID}/>}
              </div>
            ))
          ) : (
            <p>No comments yet.</p>
          )}

          {/* Add comment form */}
          <AddComment postID={postID} />
        </div>
      </div>
    </div>
  );
};

export default ViewPostAndComments;
