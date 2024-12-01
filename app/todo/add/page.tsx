'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';

export default function AddTodoPage() {
    const router = useRouter();
    const { data: session } = useSession();

    const [form, setForm] = useState({
        title: '',
        details: '',
        date: '',
        startTime: '',
        endTime: '',
    });

    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async () => {
        if (!session) {
            alert('ログインが必要です');
            return;
        }

        const userId = session.user?.id;

        setIsSubmitting(true);
    
        const response = await fetch('/api/todo', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                ...form,
                startTime: form.startTime ? `${form.date}T${form.startTime}:00` : null,
                endTime: form.endTime ? `${form.date}T${form.endTime}:00` : null,
                userId,
            }),
        });
    
        if (response.ok) {
            alert('新しいTodoを追加しました');
            router.push('/todo');
        } else {
            alert('タイトルと日付は必須です');
        }
    
        setIsSubmitting(false);
    };

    return (
        <div className="max-w-lg mx-auto p-4">
        <h1 className="text-xl font-bold mb-4">新しいTodoの追加</h1>
        <div className="space-y-4">
            <input
            type="text"
            placeholder="タイトル"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            className="w-full border p-2 rounded"
            />
            <textarea
            placeholder="詳細"
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
                placeholder="開始時間"
                value={form.startTime}
                onChange={(e) => setForm({ ...form, startTime: e.target.value })}
                className="w-1/2 border p-2 rounded"
            />
            <input
                type="time"
                placeholder="終了時間"
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
            {isSubmitting ? '送信中...' : 'Todoを追加'}
            </button>
        </div>
        </div>
    );
}
