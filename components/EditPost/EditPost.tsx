'use client';
import { Post } from '@/types/types';
import useEditPost from '@/utils/useEditPost';
import { useRouter } from 'next/navigation';
import { FormEvent, useEffect, useState } from 'react';
import { ContentState, convertToRaw, EditorState } from 'draft-js';
import dynamic from 'next/dynamic';
const Editor = dynamic(() => import('react-draft-wysiwyg').then((mod) => mod.Editor), { ssr: false });
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import draftToHtml from 'draftjs-to-html';
import htmlToDraft from 'html-to-draftjs';
import Style from '@/components/EditPost/EditPost.module.css';
import { Button } from 'react-bootstrap';
import { toast } from 'react-toastify';
import { getSession } from 'next-auth/react';
import { Session } from 'next-auth';

const EditPost = ({ params }: { params: { id: number } }) => {
  const postID = params.id;
  const userID = 1;
  const [session, setSession] = useState<Session | null>(null);
  const [categoryID, setCategoryID] = useState(0);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [createdAt, setCreatedAt] = useState('');
  const [imageURL, setImageURL] = useState('');
  const [editorState, setEditorState] = useState(() => EditorState.createEmpty());
  const router = useRouter();

  const sessionChecker = async () => {
    const session = await getSession();
    if (session === null) {
      router.push(`/api/auth/signin?callbackUrl=/posts/edit/${postID}`);
    }
    setSession(session);
  };

  useEffect(() => {
    const fetchData = async () => {
      await sessionChecker();
      fetch(`http://localhost:3000/api/posts/${postID}`)
        .then((res) => res.json())
        .then((data) => {
          setPostData(data);
          const contentBlock = htmlToDraft(data.content);
          const contentState = ContentState.createFromBlockArray(contentBlock.contentBlocks);
          setEditorState(EditorState.createWithContent(contentState));
        });
    };
    fetchData();
  }, []);

  const setPostData = (data: Post) => {
    setCategoryID(data.categoryID);
    setTitle(data.title);
    setContent(data.content);
    setCreatedAt(data.createdAt);
    setImageURL(data.imageURL);
  };

  const handleEdit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    useEditPost({ postID, userID, categoryID, title, content, createdAt, imageURL });
    router.push('/');
    toast.success('Post edited successfully!', {
      theme: 'dark',
    });
  };

  if (!session) {
    return (
      <div className={Style.loadingMessage}>
        <h1>Loading page....</h1>
      </div>
    );
  }

  if (session !== null) {
    return (
      <>
        <form className={Style.editPostForm} onSubmit={(e) => handleEdit(e)}>
          <label className={Style.postLabel}>
            Edit the photo URL for the blog post
            <input
              className={Style.postInput}
              type='text'
              name='imageURL'
              defaultValue={imageURL}
              placeholder='Image URL'
              onChange={(e) => setImageURL(e.target.value)}
            />
          </label>
          <label className={Style.postLabel}>
            Edit the blog post title
            <input
              className={Style.postInput}
              type='text'
              name='title'
              defaultValue={title}
              placeholder='Blog title'
              onChange={(e) => setTitle(e.target.value)}
            />
          </label>
          <h6>
            Edit the blog post content
            <Editor
              editorState={editorState}
              onEditorStateChange={setEditorState}
              onContentStateChange={() => {
                const contentState = editorState.getCurrentContent();
                const rawContentState = convertToRaw(contentState);
                const htlmContent = draftToHtml(rawContentState);
                setContent(htlmContent);
              }}
              toolbarClassName={Style.editorToolbar}
              wrapperClassName={Style.editorWrapper}
              editorClassName={Style.editor}
            />
          </h6>
          <label className={Style.postLabel}>
            Edit the category for the blog post
            <div className={Style.postBottomWrapper}>
              <select
                className={Style.postSelect}
                name='category'
                value={categoryID}
                onChange={(e) => setCategoryID(parseInt(e.target.value, 10))}
              >
                <option value='1'>Programming</option>
                <option value='2'>Music</option>
                <option value='3'>Racing</option>
                <option value='4'>Lifestyle</option>
                <option value='5'>Other</option>
              </select>
              <Button type='submit' variant='outline-success'>
                Edit
              </Button>
            </div>
          </label>
        </form>
      </>
    );
  }
};

export default EditPost;
