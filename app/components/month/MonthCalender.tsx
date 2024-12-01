'use client';

import React, { useState } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';

const MonthCalendar: React.FC = () => {
  const [date, setDate] = useState(new Date());

  return (
    <div>
      <Calendar
        onChange={setDate}
        value={date}
        locale="ja-JP"
        calendarType="US"
      />
      <p>選択された日付: {date.toDateString()}</p>
    </div>
  );
};

export default MonthCalendar;
