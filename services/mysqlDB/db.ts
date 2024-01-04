import mysql from 'mysql2/promise';
export const getConnection = async () =>
  await mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'example',
    database: 'aldis_blog_database',
  });

interface ExecuteQueryTypes {
  query: string;
  values?: unknown[];
}

export default async function executeQuery({ query, values }: ExecuteQueryTypes) {
  try {
    const connection = await getConnection();
    const [rows] = await connection.execute(query, values);
    await connection.end();
    return rows;
  } catch (error) {
    return { error };
  }
}
