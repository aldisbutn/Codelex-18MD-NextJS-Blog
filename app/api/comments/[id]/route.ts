import executeQuery from '@/services/mysqlDB/db';
import { NextResponse, NextRequest } from 'next/server';

// Get all comments where postID matches
export const GET = async (req: NextRequest, { params }: { params: { id: number } }) => {
  const postID = params.id;
  const comment = await executeQuery({
    query: 'SELECT * FROM Comments WHERE postID = ?',
    values: [postID],
  });
  return NextResponse.json(comment);
};

// Delete comment with provided ID
export const DELETE = async (req: NextRequest, { params }: { params: { id: number } }) => {
  try {
    const commentID = params.id;
    await executeQuery({
      query: 'DELETE FROM Comments WHERE commentID = ?',
      values: [commentID],
    });
    return NextResponse.json({ message: 'Deleted' });
  } catch (error) {
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
};
