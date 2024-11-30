<<<<<<< HEAD
import React from 'react'
import getCurrentUser from '@/app/actions/getCurrentUser'

const Home = async () => {
  const currentUser = await getCurrentUser()
  return (
    <div className='text-center'>
      {
        currentUser ? 
        <div>認証中</div>: 
        <div>未認証</div>}
      
    </div>
  )
}

export default Home
=======
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
        <button onClick={() => signOut()} style={buttonStyle}>
          Sign out
        </button>
      </div>
    );
  }

  // サインアウトしている場合のUI
  return (
    <div style={{ textAlign: 'center', marginTop: '2rem' }}>
      <p>Not signed in</p>
      <button onClick={() => signIn()} style={buttonStyle}>
        Sign in
      </button>
    </div>
  );
}

// ボタンのスタイルを統一
const buttonStyle: React.CSSProperties = {
  padding: '10px 20px',
  backgroundColor: '#0070f3',
  color: 'white',
  border: 'none',
  borderRadius: '5px',
  cursor: 'pointer',
};
>>>>>>> main
