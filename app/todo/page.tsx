'use client';

import { useEffect, useState } from 'react';
import { format, addDays, startOfWeek, endOfWeek } from 'date-fns';

interface Todo {
    id: string;
    title: string;
    isComplete: boolean;
    startTime: string; // ISO形式
    endTime: string;   // ISO形式
}

export default function TodoPage() {
    const [todos, setTodos] = useState<Todo[]>([]);
    const [currentDate, setCurrentDate] = useState(() => {
        const now = new Date();
        now.setHours(0, 0, 0, 0); // Reset time
        return now;
    });

    const [weekDates, setWeekDates] = useState<Date[]>([]);

    useEffect(() => {
        const start = startOfWeek(currentDate, { weekStartsOn: 1 });
        const end = endOfWeek(currentDate, { weekStartsOn: 1 });
        const dates = [];
        for (let day = start; day <= end; day = addDays(day, 1)) {
            dates.push(day);
        }
        setWeekDates(dates);
    }, [currentDate]);

    useEffect(() => {
        const fetchTodos = async () => {
            const date = currentDate.toLocaleDateString('en-CA');
            const response = await fetch(`/api/todo?date=${date}`);
            if (response.ok) {
                setTodos(await response.json());
            }
        };
        fetchTodos();
    }, [currentDate]);

    const toggleComplete = async (id: string, isComplete: boolean) => {
        await fetch('/api/todo', {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id, isComplete }),
        });

        setTodos((prev) =>
            prev.map((todo) => (todo.id === id ? { ...todo, isComplete } : todo))
        );
    };

    return (
        <div className="flex flex-col h-screen">
            {/* 1週間のナビゲーション */}
            <div className="bg-gray-200 py-2 px-4 fixed top-16 left-0 w-full z-10">
                <div className="flex justify-between items-center">
                    <button
                        className="text-blue-500 hover:underline"
                        onClick={() => setCurrentDate(addDays(currentDate, -7))}
                    >
                        前の週
                    </button>
                    <div className="flex space-x-2">
                        {weekDates.map((date) => (
                            <button
                                key={date.toISOString()}
                                className={`px-3 py-1 rounded ${
                                    format(date, 'yyyy-MM-dd') === format(currentDate, 'yyyy-MM-dd')
                                        ? 'bg-blue-500 text-white'
                                        : 'bg-white text-blue-500 hover:bg-blue-100'
                                }`}
                                onClick={() => setCurrentDate(date)}
                            >
                                <div>{format(date, 'MM/dd')}</div>
                                <div className="text-sm">{format(date, 'EEE')}</div>
                            </button>
                        ))}
                    </div>
                    <button
                        className="text-blue-500 hover:underline"
                        onClick={() => setCurrentDate(addDays(currentDate, 7))}
                    >
                        次の週
                    </button>
                </div>
            </div>

            <div className="flex-1 overflow-y-auto bg-gray-50 px-2 py-2 mt-[92px] relative">
                <div className="relative flex mx-2">
                    {/* タイムライン */}
                    <div className="flex-shrink-0 w-20 text-right text-gray-400">
                        {Array.from({ length: 24 }).map((_, i) => (
                            <div key={i} className="h-16 border-t border-gray-300 text-xs">
                                {i}:00
                            </div>
                        ))}
                    </div>

                    {/* タスクリスト */}
                    <div className="flex-1 ml-2 relative bg-white shadow-md rounded-md p-2">
                        {todos.map((todo, index) => {
                            const start = new Date(todo.startTime);
                            const end = new Date(todo.endTime);
                            const startHours = start.getHours() + start.getMinutes() / 60;
                            const endHours = end.getHours() + end.getMinutes() / 60;

                            const hourHeight = 96;
                            const top = startHours * hourHeight;
                            let height = (endHours - startHours) * hourHeight;

                            const minHeight = 64;
                            if (height < minHeight) {
                                height = minHeight;
                            }

                            const overlaps = todos.filter((otherTodo, otherIndex) => {
                                if (index === otherIndex) return false;
                                const otherStart = new Date(otherTodo.startTime);
                                const otherEnd = new Date(otherTodo.endTime);
                                return start < otherEnd && end > otherStart;
                            });

                            const totalOverlaps = overlaps.length + 1;
                            const overlapIndex = overlaps.findIndex((overlapTodo) => overlapTodo.id === todo.id);

                            const width = `${100 / totalOverlaps}%`;
                            const left = `${(index % totalOverlaps) * (100 / totalOverlaps)}%`;

                            const colors = ['bg-blue-200', 'bg-green-200', 'bg-yellow-200', 'bg-red-200', 'bg-purple-200'];
                            const color = colors[index % colors.length];
                            const completedStyle = todo.isComplete
                                ? 'bg-gray-300 text-gray-500 line-through'
                                : color;

                            return (
                                <div
                                    key={todo.id}
                                    className={`absolute p-2 rounded shadow-md ${completedStyle}`}
                                    style={{
                                        top: `${top}px`,
                                        height: `${height}px`,
                                        left: left,
                                        width: width,
                                    }}
                                >
                                    <div className="flex justify-between items-center">
                                        <div className="font-bold">
                                            {todo.title}
                                        </div>
                                        <div className="relative ml-2">
                                            <input
                                                type="checkbox"
                                                checked={todo.isComplete}
                                                onChange={(e) =>
                                                    toggleComplete(todo.id, e.target.checked)
                                                }
                                                className="w-6 h-6 cursor-pointer appearance-none border-2 border-gray-400 rounded-md checked:bg-blue-500 checked:border-blue-500 transition duration-200 ease-in-out"
                                            />
                                            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                                                {todo.isComplete && (
                                                    <svg
                                                        xmlns="http://www.w3.org/2000/svg"
                                                        className="w-4 h-4 text-white animate-scale-up"
                                                        fill="none"
                                                        viewBox="0 0 24 24"
                                                        stroke="currentColor"
                                                        strokeWidth={2}
                                                    >
                                                        <path
                                                            strokeLinecap="round"
                                                            strokeLinejoin="round"
                                                            d="M5 13l4 4L19 7"
                                                        />
                                                    </svg>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="text-sm">
                                        {format(start, 'HH:mm')} - {format(end, 'HH:mm')}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>



            {/* フッター */}
            <footer className="bg-white border-t border-gray-300 flex justify-between items-center p-4 fixed bottom-0 left-0 w-full z-10">
                <button
                    onClick={() => setCurrentDate(addDays(currentDate, -1))}
                    className="text-blue-500 hover:underline"
                >
                    前日
                </button>
                <button
                    onClick={() => window.location.href = '/todo/add'}
                    className="bg-blue-500 text-white px-4 py-2 rounded shadow hover:bg-blue-600"
                >
                    タスクを追加
                </button>
                <button
                    onClick={() => setCurrentDate(addDays(currentDate, 1))}
                    className="text-blue-500 hover:underline"
                >
                    翌日
                </button>
            </footer>
        </div>
    );
}
