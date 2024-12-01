'use client';

import { useState } from 'react';

interface TaskModalProps {
    todo: any;
    onClose: () => void;
    onUpdate: (updatedTodo: any) => void;
    onDelete: (id: string) => void;
}

const TaskModal: React.FC<TaskModalProps> = ({ todo, onClose, onUpdate, onDelete }) => {
    const [form, setForm] = useState({
        title: todo.title,
        details: todo.details || '',
        startTime: todo.startTime,
        endTime: todo.endTime,
    });

    const handleUpdate = async () => {
        const response = await fetch(`/api/todo`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                id: todo.id,
                ...form,
            }),
        });

        if (response.ok) {
            const updatedTodo = await response.json();
            onUpdate(updatedTodo);
            onClose();
        } else {
            alert('更新に失敗しました');
        }
    };

    const handleDelete = async () => {
        const response = await fetch(`/api/todo?id=${todo.id}`, {
            method: 'DELETE',
        });

        if (response.ok) {
            onDelete(todo.id);
            onClose();
        } else {
            alert('削除に失敗しました');
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-lg">
                <h2 className="text-lg font-bold mb-4">タスク詳細</h2>
                <div className="space-y-4">
                    <input
                        type="text"
                        value={form.title}
                        onChange={(e) => setForm({ ...form, title: e.target.value })}
                        className="w-full border p-2 rounded"
                        placeholder="タイトル"
                    />
                    <textarea
                        value={form.details}
                        onChange={(e) => setForm({ ...form, details: e.target.value })}
                        className="w-full border p-2 rounded"
                        placeholder="詳細"
                    ></textarea>
                    <input
                        type="datetime-local"
                        value={form.startTime || ''}
                        onChange={(e) => setForm({ ...form, startTime: e.target.value })}
                        className="w-full border p-2 rounded"
                    />
                    <input
                        type="datetime-local"
                        value={form.endTime || ''}
                        onChange={(e) => setForm({ ...form, endTime: e.target.value })}
                        className="w-full border p-2 rounded"
                    />
                </div>
                <div className="mt-6 flex justify-between">
                    <button
                        onClick={handleDelete}
                        className="bg-red-500 text-white px-4 py-2 rounded"
                    >
                        削除
                    </button>
                    <div>
                        <button
                            onClick={onClose}
                            className="bg-gray-300 px-4 py-2 rounded mr-2"
                        >
                            閉じる
                        </button>
                        <button
                            onClick={handleUpdate}
                            className="bg-blue-500 text-white px-4 py-2 rounded"
                        >
                            更新
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TaskModal;
