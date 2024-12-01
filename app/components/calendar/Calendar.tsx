import React from 'react';

type CalendarProps = {
  selectedDate: Date;
  onDateChange: (date: Date) => void;
};

const Calendar = ({ selectedDate, onDateChange }: CalendarProps) => {
  const handleDayClick = (day: number) => {
    const newDate = new Date(selectedDate.getFullYear(), selectedDate.getMonth(), day);
    onDateChange(newDate);
  };

  const daysInMonth = new Date(selectedDate.getFullYear(), selectedDate.getMonth() + 1, 0).getDate();
  const daysArray = Array.from({ length: daysInMonth }, (_, i) => i + 1);

  return (
    <div className="calendar">
      <h3>{selectedDate.getFullYear()}年 {selectedDate.getMonth() + 1}月</h3>
      <div className="calendar-grid">
        {daysArray.map(day => (
          <button key={day} onClick={() => handleDayClick(day)}>
            {day}
          </button>
        ))}
      </div>
    </div>
  );
};

export default Calendar;
