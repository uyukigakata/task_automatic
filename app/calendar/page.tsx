'use client';

import React, { useState, useEffect } from 'react';
import {
  format,
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  isSameDay,
  isSameMonth,
  setYear,
  setMonth,
} from 'date-fns';
import { ja } from 'date-fns/locale';
import { useRouter } from 'next/navigation'; // Next.jsのルーター

const CalendarPage: React.FC = () => {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [tasks, setTasks] = useState<any[]>([]); // タスクリスト
  const [isYearPickerOpen, setIsYearPickerOpen] = useState(false);
  const [isMonthPickerOpen, setIsMonthPickerOpen] = useState(false);
  const router = useRouter(); // ルーターインスタンス

  // API経由で指定日のタスクを取得
  const fetchTasks = async (date: Date) => {
    const formattedDate = format(date, 'yyyy-MM-dd');
    const response = await fetch(`/api/todo?date=${formattedDate}`);
    const data = await response.json();
    setTasks(data);
  };

  // 初回レンダリングと日付変更時にタスクを取得
  useEffect(() => {
    fetchTasks(selectedDate);
  }, [selectedDate]);

  // 月の日付リストを生成
  const generateDaysArray = (start: Date, end: Date): Date[] => {
    const days: Date[] = [];
    let currentDate = start;

    while (currentDate <= end) {
      days.push(new Date(currentDate));
      currentDate.setDate(currentDate.getDate() + 1);
    }

    return days;
  };

  const days = generateDaysArray(
    startOfWeek(startOfMonth(selectedDate), { locale: ja }),
    endOfWeek(endOfMonth(selectedDate), { locale: ja })
  );

  // 指定日付のタスクを取得
  const getTasksForDate = (date: Date) => {
    return tasks.filter((task) => isSameDay(new Date(task.date), date));
  };

  return (
    <div className="p-4">
      {/* 年号と月の選択 */}
      <div className="flex justify-center items-center mb-4 space-x-4">
        <div className="relative">
          <button
            onClick={() => setIsYearPickerOpen(!isYearPickerOpen)}
            className="text-xl font-bold hover:underline"
          >
            {format(selectedDate, 'yyyy')}年
          </button>
          {isYearPickerOpen && (
            <div className="absolute z-10 bg-white border rounded-md shadow-md max-h-40 overflow-auto">
              {Array.from({ length: 21 }, (_, i) => 2020 + i).map((year) => (
                <div
                  key={year}
                  onClick={() => {
                    setSelectedDate(setYear(selectedDate, year));
                    setIsYearPickerOpen(false);
                  }}
                  className="p-2 hover:bg-gray-200 cursor-pointer text-center"
                >
                  {year}年
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      <div className="flex justify-center items-center mb-4 space-x-4">
        {/* 月移動ボタン */}
        <button
          onClick={() => setSelectedDate((prev) => setMonth(prev, prev.getMonth() - 1))}
          className="text-xl font-bold hover:underline"
        >
          ←
        </button>
        <div className="relative">
          <button
            onClick={() => setIsMonthPickerOpen(!isMonthPickerOpen)}
            className="text-xl font-bold hover:underline"
          >
            {format(selectedDate, 'M')}月
          </button>
          {isMonthPickerOpen && (
            <div className="absolute z-10 bg-white border rounded-md shadow-md max-h-40 overflow-auto">
              {Array.from({ length: 12 }, (_, i) => i).map((month) => (
                <div
                  key={month}
                  onClick={() => {
                    setSelectedDate(setMonth(selectedDate, month));
                    setIsMonthPickerOpen(false);
                  }}
                  className="p-2 hover:bg-gray-200 cursor-pointer text-center"
                >
                  {month + 1}月
                </div>
              ))}
            </div>
          )}
        </div>
        <button
          onClick={() => setSelectedDate((prev) => setMonth(prev, prev.getMonth() + 1))}
          className="text-xl font-bold hover:underline"
        >
          →
        </button>
      </div>

      {/* 曜日ヘッダー */}
      <div className="grid grid-cols-7 gap-2 text-center text-sm text-gray-500">
        {['日', '月', '火', '水', '木', '金', '土'].map((day) => (
          <div key={day} className="font-medium">
            {day}
          </div>
        ))}
      </div>

      {/* カレンダー */}
      <div className="grid grid-cols-7 gap-1 mt-2">
        {days.map((day) => {
          const dayTasks = getTasksForDate(day);
          return (
            <div
              key={day.toString()}
              onClick={() => setSelectedDate(day)} // 日付選択
              onDoubleClick={() => {
                // ダブルクリックでクリックした日のタスク画面に遷移
                const formattedDate = format(day, 'yyyy-MM-dd');
                router.push(`/todo?date=${formattedDate}`);
              }}
              className={`p-2 border rounded-lg hover:bg-gray-100 ${
                isSameDay(day, selectedDate) ? 'bg-blue-500 text-white' : ''
              }`}
            >
              <div
                className={`font-bold ${
                  !isSameMonth(day, selectedDate) ? 'text-gray-400' : ''
                }`}
              >
                {format(day, 'd')}
              </div>
              {/* タスク表示 */}
              <div className="text-xs mt-1 space-y-1">
                {dayTasks.map((task, idx) => (
                  <div
                    key={idx}
                    className="bg-green-200 text-green-700 rounded-md px-1 py-0.5 truncate"
                  >
                    {task.title}
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {/* タスクリスト */}
      <div className="mt-6">
        <h2 className="text-lg font-bold mb-2">タスク一覧 ({format(selectedDate, 'yyyy/MM/dd')}):</h2>
        <ul className="list-disc ml-6">
          {getTasksForDate(selectedDate).map((task) => (
            <li key={task.id} className="text-sm">
              <span className="font-semibold">{task.title}</span>
              {task.startTime && (
                <span className="ml-2 text-gray-500">
                  ({format(new Date(task.startTime), 'HH:mm')}～
                  {task.endTime ? format(new Date(task.endTime), 'HH:mm') : '未設定'})
                </span>
              )}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default CalendarPage;
