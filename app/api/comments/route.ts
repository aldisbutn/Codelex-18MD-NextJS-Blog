import executeQuery from '@/services/mysqlDB/db';
import { NextResponse, NextRequest } from 'next/server';

export const GET = async () => {
  const comments = await executeQuery({
    query: 'SELECT * FROM Comments',
    values: [],
  });
  return NextResponse.json(comments);
};

export const POST = async (req: NextRequest) => {
  try {
    const { postID, author, content, createdAt } = await req.json();
    await executeQuery({
      query: `INSERT INTO Comments (postID, author, content, createdAt)
      VALUES (?, ?, ?, ?);`,
      values: [postID, author, content, createdAt],
    });
    return NextResponse.json({ message: 'Operation successful' }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
};
