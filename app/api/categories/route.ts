import executeQuery from '@/services/mysqlDB/db';
import { NextResponse } from 'next/server';

// Get all categories
export const GET = async () => {
  const categories = await executeQuery({
    query: 'SELECT * FROM Categories',
    values: [],
  });
  return NextResponse.json(categories);
};
