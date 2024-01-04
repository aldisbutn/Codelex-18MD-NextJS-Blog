import executeQuery from '@/services/mysqlDB/db';
import { Post } from '@/types/types';
import { NextResponse, NextRequest } from 'next/server';

// Get post with provided ID
export const GET = async (req: NextRequest, { params }: { params: { id: number } }) => {
  const postID = params.id;
  const post = (await executeQuery({
    query: 'SELECT * FROM Posts WHERE postID = ?',
    values: [postID],
  })) as Post[];
  return NextResponse.json(post[0]);
};

// Update post with provided ID
export const PUT = async (req: NextRequest, { params }: { params: { id: number } }) => {
  try {
    const postID = params.id;
    const { userID, categoryID, title, content, createdAt, imageURL } = await req.json();
    await executeQuery({
      query:
        'UPDATE Posts SET userID = ?, categoryID = ?, title = ?, content = ?, createdAt = ?, imageURL = ? WHERE postID = ?',
      values: [userID, categoryID, title, content, createdAt, imageURL, postID],
    });
    return NextResponse.json({ message: 'Operation successful' }, { status: 200 });
  } catch (error) {
    console.error('PUT request error:', error);
    return NextResponse.json({ message: 'Error updating post' }, { status: 500 });
  }
};

// Delete all comments where postID matches and delete post with provided ID
export const DELETE = async (req: NextRequest, { params }: { params: { id: number } }) => {
  try {
    const postID = params.id;
    await executeQuery({
      query: `DELETE FROM Comments WHERE postID = ?`,
      values: [postID],
    });

    await executeQuery({
      query: `DELETE FROM Posts WHERE postID = ?`,
      values: [postID],
    });
    return NextResponse.json({ message: 'Operation successful' }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
};
