namespace NodeJS {
  interface ProcessEnv extends NodeJS {
    NEXTAUTH_SECRET: string;
    NEXTAUTH_URL: string;
    DATABASE_URL: string;
  }
}
