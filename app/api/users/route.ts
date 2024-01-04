import executeQuery from '@/services/mysqlDB/db';
import { User } from '@/types/types';
import { NextResponse } from 'next/server';

export const GET = async () => {
  const user = (await executeQuery({
    query: 'SELECT * FROM Users WHERE userID = 1',
    values: [],
  })) as User[];
  return NextResponse.json(user[0]);
};
