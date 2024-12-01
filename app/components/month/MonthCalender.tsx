'use client';

import React, { useState } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';

const MonthCalendar: React.FC = () => {
  const [date, setDate] = useState<Date | null>(new Date());

  const handleDateChange = (value: Date | Date[] | null) => {
    if (value && !Array.isArray(value)) {
      setDate(value);
    }
  };

  return (
    <div>
      <Calendar
        onChange={handleDateChange}
        value={date}
        locale="ja-JP"
        calendarType="ISO 8601"
      />
      <p>選択された日付: {date?.toLocaleDateString('ja-JP')}</p>
    </div>
  );
};

export default MonthCalendar;
