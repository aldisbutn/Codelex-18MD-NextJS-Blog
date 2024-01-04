import executeQuery from '@/services/mysqlDB/db';
import { NextResponse, NextRequest } from 'next/server';

export const GET = async () => {
  const posts = await executeQuery({
    query: 'SELECT * FROM Posts',
    values: [],
  });
  return NextResponse.json({ posts });
};

export const POST = async (req: NextRequest) => {
  try {
    const { userID, categoryID, title, content, createdAt, imageURL } = await req.json();
    await executeQuery({
      query: `INSERT INTO Posts (userID, categoryID, title, content, createdAt, imageURL)
      VALUES (?, ?, ?, ?, ?, ?);`,
      values: [userID, categoryID, title, content, createdAt, imageURL],
    });
    return NextResponse.json({ message: 'Operation successful' }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
};
