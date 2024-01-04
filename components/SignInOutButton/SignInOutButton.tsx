'use client';

import { useSession, signIn, signOut } from 'next-auth/react';
import { Button } from 'react-bootstrap';

const SignInOutButton = () => {
  const { data: session } = useSession();
  // Show either sign in or sign out button depending on if user is logged in
  return (
    <>
      {session ? (
        <Button onClick={() => signOut()}>Sign Out</Button>
      ) : (
        <Button onClick={() => signIn()}>Sign In</Button>
      )}
    </>
  );
};

export default SignInOutButton;
