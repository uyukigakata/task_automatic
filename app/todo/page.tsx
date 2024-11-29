'use client';

import { useEffect, useState } from 'react';

interface Todo {
    id: string;
    title: string;
    isComplete: boolean;
}

export default function TodoPage() {
    const [todos, setTodos] = useState<Todo[]>([]);
    const [currentDate, setCurrentDate] = useState(() => {
        const now = new Date();
        now.setHours(0, 0, 0, 0); // 時間をリセット
        return now;
    });

    useEffect(() => {
        const fetchTodos = async () => {
        const date = currentDate.toISOString().split('T')[0]; // YYYY-MM-DD形式
        const response = await fetch(`/api/todo?date=${date}`);
        if (response.ok) {
            setTodos(await response.json());
        }
        };
        fetchTodos();
    }, [currentDate]);

    // 型を明示
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
        <div>
        <h1>Todos for {currentDate.toDateString()}</h1>
        <ul>
            {todos.map((todo) => (
            <li key={todo.id}>
                <input
                type="checkbox"
                checked={todo.isComplete}
                onChange={(e) => toggleComplete(todo.id, e.target.checked)}
                />
                {todo.title}
            </li>
            ))}
        </ul>
        <button onClick={() => setCurrentDate(new Date(currentDate.setDate(currentDate.getDate() - 1)))}>
            Previous Day
        </button>
        <button onClick={() => setCurrentDate(new Date(currentDate.setDate(currentDate.getDate() + 1)))}>
            Next Day
        </button>
        </div>
    );
}
