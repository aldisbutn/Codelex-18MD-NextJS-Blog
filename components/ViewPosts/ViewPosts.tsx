import Style from '@/components/ViewPosts/ViewPosts.module.css';
import useGetPosts from '@/utils/useGetPosts';
import useGetComments from '@/utils/useGetComments';
import useGetCategories from '@/utils/useGetCategories';
import { Category, Post, PostComment } from '@/types/types';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from 'react-bootstrap';
import { getServerSession } from 'next-auth';
import { parseISO, format } from 'date-fns';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

const ViewPosts = async () => {
  // Get posts, comments, categories and session
  const posts = (await useGetPosts()) as Post[];
  const comments = (await useGetComments()) as PostComment[];
  const categories = (await useGetCategories()) as Category[];
  const session = await getServerSession(authOptions);

  // Function to find the number of comments for a post
  const findCommentByIDReturnLength = (id: number) => {
    const commentsWithID = comments.filter((comment) => comment.postID === id);
    return commentsWithID.length;
  };

  // Function to find the category name by ID
  const findCategoryByID = (id: number) => {
    const categoryByID = categories.find((category) => category.categoryID === id);
    return categoryByID?.categoryName;
  };

  // Function to format the date
  const formatDateForPost = (date: string, id: number) => {
    const post = posts!.find((post) => post.postID === id);
    const postDate = parseISO(post!.createdAt);
    return format(postDate, 'dd.MM.yyyy');
  };

  // If there are no posts, display a loading message
  if (!posts) {
    return (
      <div className={Style.loadingMessage}>
        <h1>Loading page....</h1>
      </div>
    );
  }

  return (
    <section className={Style.postsSection}>
      {posts.map((post) => (
        <div className={Style.postWrapper} key={post.postID}>
          {/* Image display */}
          <Image
            src={post.imageURL}
            alt={post.title}
            width={0}
            height={0}
            sizes='100vw'
            style={{ width: '100%', height: 'auto' }}
            priority={true}
            className={Style.postImage}
            placeholder='empty'
          />

          {/* Link that takes to the specific category post view  */}
          <Link href={`/posts/category/${post.categoryID}`} className={Style.categoryButton}>
            {findCategoryByID(post.categoryID)}
          </Link>

          {/* Link that takes to the specific post view */}
          <Link href={`/posts/${post.postID}`} className={Style.postLink}>
            <div className={Style.textWrapper}>
              <h2 className={Style.postTitle}>{post.title}</h2>
              <h4 className={Style.postTitleComments}>({findCommentByIDReturnLength(post.postID)})</h4>
            </div>
          </Link>

          {/* Date display */}
          <h6 className={Style.postDate}>{formatDateForPost(post.createdAt, post.postID)}</h6>

          {/* If user is not logged in, do not show edit button */}
          {session === null ? (
            <></>
          ) : (
            <Link href={`/posts/edit/${post.postID}`}>
              <Button variant='outline-light' className={Style.editButton} type='button'>
                Edit post
              </Button>
            </Link>
          )}
        </div>
      ))}
    </section>
  );
};

export default ViewPosts;
