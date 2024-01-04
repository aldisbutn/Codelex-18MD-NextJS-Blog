import NextAuth, { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { NextApiHandler } from 'next';
import { User } from '@/types/types';
import executeQuery, { getConnection } from '@/services/mysqlDB/db';
import { compare } from 'bcrypt';

type Credentials = {
  email: string;
  password: string;
};



export const authOptions: NextAuthOptions = {
  secret: process.env.NEXTAUTH_SECRET,
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'text' },
        password: { label: 'Password', type: 'password' },
      },

      async authorize(credentials: Credentials) {
        const { email, password } = credentials;
        await getConnection();
        try {
          const user = (await executeQuery({
            query: 'SELECT * FROM Users WHERE email = ?',
            values: [email],
          })) as User[];

          if (user.length === 0) {
            throw new Error('No user found');
          }

          const isPasswordCorrect = await compare(password, user[0].password);

          if(isPasswordCorrect) {
            return user[0];
          } else {
            throw new Error('Incorrect password');
          }

        } catch (error) {
          throw new Error((error as Error).message);
        }
      },
    }),
  ],

  session: {
    strategy: 'jwt',
  },
  // 7 days
  jwt: {
    maxAge: 7 * 24 * 60 * 60,
  },
};

const handler: NextApiHandler = NextAuth(authOptions);

export { handler as GET, handler as POST };
