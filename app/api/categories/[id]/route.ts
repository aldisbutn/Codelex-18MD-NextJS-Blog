import executeQuery from '@/services/mysqlDB/db';

import { NextResponse, NextRequest } from 'next/server';

export const GET = async (req: NextRequest, { params }: { params: { id: number } }) => {
  const categoryID = params.id;
  const categories = await executeQuery({
    query: 'SELECT * FROM Categories WHERE categoryID = ?',
    values: [categoryID],
  });
  return NextResponse.json(categories);
};
