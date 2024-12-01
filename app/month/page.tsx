'use client';

import React, { useState } from 'react';
import {
  format,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  startOfWeek,
  endOfWeek,
  isSameDay,
  addYears,
  subYears,
  setYear,
  setMonth,
} from 'date-fns';
import ja from 'date-fns/locale/ja';

const MonthPage: React.FC = () => {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [isYearPickerOpen, setIsYearPickerOpen] = useState(false);
  const [isMonthPickerOpen, setIsMonthPickerOpen] = useState(false);

  // サンプルイベントデータ
  const events = [
    { date: new Date(2024, 11, 1), title: 'スマプロ' },
    { date: new Date(2024, 11, 6), title: 'インターン' },
    { date: new Date(2024, 11, 18), title: 'セキプロ' },
    { date: new Date(2024, 11, 25), title: 'クリスマス' },
    { date: new Date(2024, 11, 31), title: '大晦日' },
  ];

  // 年号変更関数
  const handleYearChange = (year: number) => {
    setSelectedDate(setYear(selectedDate, year));
    setIsYearPickerOpen(false);
  };

  // 月変更関数
  const handleMonthChange = (month: number) => {
    setSelectedDate(setMonth(selectedDate, month));
    setIsMonthPickerOpen(false);
  };

  // 月の日付リストを生成 (前後の週も含む)
  const days = eachDayOfInterval({
    start: startOfWeek(startOfMonth(selectedDate), { locale: ja }),
    end: endOfWeek(endOfMonth(selectedDate), { locale: ja }),
  });

  // 年リストと月リストを生成
  const years = Array.from({ length: 21 }, (_, i) => 2020 + i); // 2020年から2040年まで
  const months = Array.from({ length: 12 }, (_, i) => i); // 0から11（1月～12月）

  return (
    <div className="p-4">
      {/* 年号と月の表示 */}
      <div className="flex justify-center items-center mb-4 space-x-2">
        <div className="relative">
          <button
            onClick={() => setIsYearPickerOpen(!isYearPickerOpen)}
            className="text-xl font-bold hover:underline"
          >
            {format(selectedDate, 'yyyy')}年
          </button>
          {isYearPickerOpen && (
            <div className="absolute z-10 bg-white border rounded-md shadow-md max-h-40 overflow-auto">
              {years.map((year) => (
                <div
                  key={year}
                  onClick={() => handleYearChange(year)}
                  className="p-2 hover:bg-gray-200 cursor-pointer text-center"
                >
                  {year}年
                </div>
              ))}
            </div>
          )}
        </div>
        <div className="relative">
          <button
            onClick={() => setIsMonthPickerOpen(!isMonthPickerOpen)}
            className="text-xl font-bold hover:underline"
          >
            {format(selectedDate, 'M')}月
          </button>
          {isMonthPickerOpen && (
            <div className="absolute z-10 bg-white border rounded-md shadow-md max-h-40 overflow-auto">
              {months.map((month) => (
                <div
                  key={month}
                  onClick={() => handleMonthChange(month)}
                  className="p-2 hover:bg-gray-200 cursor-pointer text-center"
                >
                  {month + 1}月
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* カレンダーの曜日ヘッダー */}
      <div className="grid grid-cols-7 gap-2 text-center text-sm text-gray-500">
        {['日', '月', '火', '水', '木', '金', '土'].map((day) => (
          <div key={day} className="font-medium">
            {day}
          </div>
        ))}
      </div>

      {/* カレンダー本体 */}
      <div className="grid grid-cols-7 gap-1 mt-2">
        {days.map((day) => (
          <div
            key={day.toString()}
            onClick={() => setSelectedDate(day)}
            className={`p-2 border rounded-lg hover:bg-gray-100 ${
              isSameDay(day, selectedDate) ? 'bg-blue-500 text-white' : ''
            }`}
          >
            <div
              className={`font-bold ${
                day.getMonth() !== selectedDate.getMonth() ? 'text-gray-400' : ''
              }`}
            >
              {format(day, 'd')}
            </div>
            <div className="text-xs mt-1 space-y-1">
              {events
                .filter((event) => isSameDay(event.date, day))
                .map((event, idx) => (
                  <div
                    key={idx}
                    className="bg-blue-100 text-blue-500 rounded-md px-1 py-0.5 text-xs truncate"
                  >
                    {event.title}
                  </div>
                ))}
            </div>
          </div>
        ))}
      </div>

      {/* 選択された日付 */}
      <p className="mt-4 text-center text-sm text-gray-600">
        選択された日付: {format(selectedDate, 'yyyy/MM/dd', { locale: ja })}
      </p>
    </div>
  );
};

export default MonthPage;
