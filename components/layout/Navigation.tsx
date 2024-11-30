'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

interface NavItem {
    label: string;
    href: string;
    icon: React.ReactNode;
}

const Navigation: React.FC = () => {
    const pathname = usePathname();

    const navItems: NavItem[] = [
        { label: 'Calender', href: '/calender', icon: <HomeIcon /> },
        { label: 'TodoAdd', href: '/todo/add', icon: <SearchIcon /> },
        { label: 'Notification', href: '/notification', icon: <ProfileIcon /> },
    ];

    return (
        <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-50">
        <div className="flex justify-around items-center h-16">
            {navItems.map((item) => (
            <Link key={item.href} href={item.href}>
                <div
                className={`flex flex-col items-center text-sm ${
                    pathname === item.href ? 'text-blue-500' : 'text-gray-500'
                }`}
                >
                {item.icon}
                <span>{item.label}</span>
                </div>
            </Link>
            ))}
        </div>
        </nav>
    );
};

// アイコン（SVG）の例
const HomeIcon = () => (
    <svg
        className="w-6 h-6"
        fill="none"
        stroke="currentColor"
        strokeWidth={2}
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
    >
        <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M3 9.5l8.485-6.364a1 1 0 011.03 0L21 9.5V21a2 2 0 01-2 2h-4a2 2 0 01-2-2v-6h-2v6a2 2 0 01-2 2H5a2 2 0 01-2-2V9.5z"
        ></path>
    </svg>
);

const SearchIcon = () => (
    <svg
        className="w-6 h-6"
        fill="none"
        stroke="currentColor"
        strokeWidth={2}
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
    >
        <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M8 16l-4-4m0 0l4-4m-4 4h16"
        ></path>
    </svg>
);

const ProfileIcon = () => (
    <svg
        className="w-6 h-6"
        fill="none"
        stroke="currentColor"
        strokeWidth={2}
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
    >
        <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M12 12c2.67 0 8 1.34 8 4v2H4v-2c0-2.66 5.33-4 8-4zm0-2a3 3 0 100-6 3 3 0 000 6z"
        ></path>
    </svg>
);

export default Navigation;
