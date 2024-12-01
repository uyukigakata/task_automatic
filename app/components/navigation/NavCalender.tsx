'use client'

import { useRouter } from 'next/navigation'; // Next.jsのルーター
import { FiCalendar } from 'react-icons/fi'; // カレンダーアイコン用のライブラリ (react-icons)

const NavCalender = () => {
  const router = useRouter(); // ページ遷移用のルーター

  return (
    <div className="flex items-center justify-center">
      <button
        onClick={() => router.push('/calendar')} // /calendarに遷移
        className="p-2 bg-blue-600 text-white rounded-full hover:bg-blue-800 transition"
        aria-label="カレンダーに移動"
      >
        <FiCalendar size={24} /> {/* カレンダーアイコン */}
      </button>
    </div>
  );
}

export default NavCalender;
