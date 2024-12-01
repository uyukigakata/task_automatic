'use client';

import React, { useState } from 'react';
import { addDays, startOfWeek, format } from 'date-fns';
import { ja } from 'date-fns/locale';

const WeekSlider: React.FC = () => {
  const [currentDate, setCurrentDate] = useState(new Date());

  const startOfCurrentWeek = startOfWeek(currentDate, { locale: ja });

  const daysOfWeek = Array.from({ length: 7 }).map((_, index) =>
    addDays(startOfCurrentWeek, index)
  );

  const handlePrevWeek = () => {
    setCurrentDate(addDays(currentDate, -7));
  };

  const handleNextWeek = () => {
    setCurrentDate(addDays(currentDate, 7));
  };

  return (
    <div>
      <button onClick={handlePrevWeek}>前の週</button>
      <button onClick={handleNextWeek}>次の週</button>
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        {daysOfWeek.map((day) => (
          <div key={day.toISOString()}>
            <p>{format(day, 'yyyy年MM月dd日 (EEE)', { locale: ja })}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default WeekSlider;
