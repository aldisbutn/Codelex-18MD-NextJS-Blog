import { DefaultSession } from 'next-auth';
import { User } from './types';

declare module 'next-auth' {
  type Session = {
    user: User & DefaultSession['user'];
  };
}

declare module 'next-auth/jwt' {
  interface JWT {
    user: User & DefaultSession['user'];
  }
}
