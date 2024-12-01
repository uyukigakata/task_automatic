'use client'

import { User } from '@prisma/client'

import Menu from '@/app/components/navigation/Menu'
import Link from 'next/link'
import NavCalender from './NavCalender'

type NavigationProps = {
    currentUser: User | null
  }

const Navigation: React.FC<NavigationProps> = ({ currentUser }) => {
    return (
        <header className="shadow-lg shadow-gray-100 bg-white fixed top-0 left-0 w-full h-16 z-20">
        <div className="container mx-auto flex max-w-screen-md items-center justify-between px-1 py-5">
            <Link href="/todo" className="cursor-pointer text-xl font-bold">
            TaskAutomatic -オートにできませんでした-
            </Link>
            <div className="flex items-center justify-center space-x-3">
                <NavCalender />
                <Menu currentUser={currentUser} />
            </div>
        </div>
        </header>
    );
}; 
 
export default Navigation