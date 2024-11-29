'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function AddTodoPage() {
    const router = useRouter();

    const [form, setForm] = useState({
        title: '',
        details: '',
        date: '',
        startTime: '',
        endTime: '',
    });

    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async () => {
        setIsSubmitting(true);

        const response = await fetch('/api/todos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            ...form,
            userId: 'your-user-id', // 本番では認証ユーザーIDを動的に取得
        }),
        });

        if (response.ok) {
        alert('Todo added successfully');
        router.push('/todo'); // 作成後にTodo一覧ページへリダイレクト
        } else {
        alert('Failed to add Todo');
        }

        setIsSubmitting(false);
    };

    return (
        <div className="max-w-lg mx-auto p-4">
        <h1 className="text-xl font-bold mb-4">Add a New Todo</h1>
        <div className="space-y-4">
            <input
            type="text"
            placeholder="Title"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            className="w-full border p-2 rounded"
            />
            <textarea
            placeholder="Details"
            value={form.details}
            onChange={(e) => setForm({ ...form, details: e.target.value })}
            className="w-full border p-2 rounded"
            ></textarea>
            <input
            type="date"
            value={form.date}
            onChange={(e) => setForm({ ...form, date: e.target.value })}
            className="w-full border p-2 rounded"
            />
            <div className="flex space-x-2">
            <input
                type="time"
                placeholder="Start Time"
                value={form.startTime}
                onChange={(e) => setForm({ ...form, startTime: e.target.value })}
                className="w-1/2 border p-2 rounded"
            />
            <input
                type="time"
                placeholder="End Time"
                value={form.endTime}
                onChange={(e) => setForm({ ...form, endTime: e.target.value })}
                className="w-1/2 border p-2 rounded"
            />
            </div>
            <button
            onClick={handleSubmit}
            disabled={isSubmitting}
            className={`w-full p-2 rounded text-white ${
                isSubmitting ? 'bg-gray-500' : 'bg-blue-500 hover:bg-blue-600'
            }`}
            >
            {isSubmitting ? 'Submitting...' : 'Add Todo'}
            </button>
        </div>
        </div>
    );
}