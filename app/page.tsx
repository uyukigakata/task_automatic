import React from 'react'
import getCurrentUser from '@/app/actions/getCurrentUser'
import Link from 'next/link';


const HomePage = async () => {
  const currentUser = await getCurrentUser()
  return (
    <div className='text-center'>
      {
        currentUser ? 
        <div>
              
          <nav>
            <ul>
              <li>
                <Link href="/week">週間カレンダー</Link>
              </li>
              <li>
                <Link href="/month">月間カレンダー</Link>
              </li>
            </ul>
          </nav>

        </div>: 
        <div>
          
          未認証
          
        </div>
      }
      
    </div>
  )
}

export default HomePage