'use client';

import { FormEvent, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { convertToRaw, EditorState } from 'draft-js';
import useSubmitPost from '@/utils/useSubmitPost';
import dynamic from 'next/dynamic';
const Editor = dynamic(() => import('react-draft-wysiwyg').then((mod) => mod.Editor), { ssr: false });
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import draftToHtml from 'draftjs-to-html';
import Style from '@/components/CreatePost/CreatePost.module.css';
import { Button } from 'react-bootstrap';
import { toast } from 'react-toastify';
import { Session } from 'next-auth';
import { getSession } from 'next-auth/react';

const CreatePost = () => {
  const initialUserID = 1;
  const initialCategoryID = 1;
  const initialTitle = '';
  const initialContent = '';
  const initialImageURL = '';
  const initialCreatedAt = new Date().toISOString();

  const [session, setSession] = useState<Session | null>(null);
  const [userID] = useState(initialUserID);
  const [categoryID, setCategoryID] = useState(initialCategoryID);
  const [title, setTitle] = useState(initialTitle);
  const [content, setContent] = useState(initialContent);
  const [imageURL, setImageURL] = useState(initialImageURL);
  const [createdAt] = useState(initialCreatedAt);

  const [editorState, setEditorState] = useState(() => EditorState.createEmpty());

  const router = useRouter();

  const sessionChecker = async () => {
    const session = await getSession();
    if (session === null) {
      router.push(`/api/auth/signin?callbackUrl=/posts/create`);
    }
    setSession(session);
  };

  useEffect(() => {
    const fetchData = async () => {
      await sessionChecker();
    };
    fetchData();
  }, []);

  const handlePost = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    await useSubmitPost({ userID, categoryID, title, content, createdAt, imageURL });

    setCategoryID(initialCategoryID);
    setTitle(initialTitle);
    setContent(initialContent);
    setImageURL(initialImageURL);

    router.push('/');
    toast.success('Post created successfully!', {
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
        <form className={Style.createPostForm} onSubmit={(e) => handlePost(e)}>
          <label className={Style.postLabel}>
            Enter the photo URL for the blog post
            <input
              className={Style.postInput}
              type='text'
              placeholder='Image URL'
              name='imageURL'
              onChange={(e) => setImageURL(e.target.value)}
              required
            />
          </label>

          <label className={Style.postLabel}>
            Enter the blog post title
            <input
              className={Style.postInput}
              type='text'
              placeholder='Blog title'
              name='title'
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </label>

          <h6>
            Enter the blog post content
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
            Choose the category for the blog post
            <div className={Style.postBottomWrapper}>
              <select
                className={Style.postSelect}
                name='category'
                onChange={(e) => setCategoryID(parseInt(e.target.value, 10))}
                required
              >
                <option value='1'>Programming</option>
                <option value='2'>Music</option>
                <option value='3'>Racing</option>
                <option value='4'>Lifestyle</option>
                <option value='5'>Other</option>
              </select>
              <Button type='submit' variant='outline-success'>
                Post
              </Button>
            </div>
          </label>
        </form>
      </>
    );
  }
};

export default CreatePost;
