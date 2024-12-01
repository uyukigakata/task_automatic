'use client';

import React, { useState } from 'react';
import Calendar from '../components/calendar/Calendar';

const CalendarPage: React.FC = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());

  const handleDateChange = (date: Date) => {
    setSelectedDate(date);
  };

  return (
    <div className="p-4">
      <div className="bg-white shadow-md rounded-md p-6">
        <Calendar selectedDate={selectedDate} onDateChange={handleDateChange} />
        <button
          onClick={() => alert(`${selectedDate.toLocaleDateString()}に移動`)}
          className="mt-4 w-full bg-red-400 text-white py-2 px-4 rounded-md"
        >
          日に移動
        </button>
      </div>
    </div>
  );
};

export default CalendarPage;
