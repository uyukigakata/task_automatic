'use client';

import { useSession, signIn, signOut } from 'next-auth/react';

export default function Home() {
  const { data: session, status } = useSession();

  // セッションが取得中の場合のローディング表示
  if (status === 'loading') {
    return <p>Loading...</p>;
  }

  // サインインしている場合のUI
  if (status === 'authenticated' && session.user) {
    return (
      <div style={{ textAlign: 'center', marginTop: '2rem' }}>
        <p>Signed in as <strong>{session.user.email}</strong></p>
        <button onClick={() => signOut()} >
          Sign out
        </button>
      </div>
    );
  }

  // サインアウトしている場合のUI
  return (
    <div style={{ textAlign: 'center', marginTop: '2rem' }}>
      <p>Not signed in</p>
      <button onClick={() => signIn()} >
        Sign in
      </button>
    </div>
  );
}
