import React, { useState, useEffect, useRef } from 'react';
import { X, Plus, Trash } from 'lucide-react';
import { Button } from "@/components/ui/button"

interface Memo {
  id: string;
  content: string;
  createdAt: Date;
}

interface MemoPadProps {
  isOpen: boolean;
  onClose: () => void;
}

export function MemoPad({ isOpen, onClose }: MemoPadProps) {
  const [memos, setMemos] = useState<Memo[]>([]);
  const [currentMemo, setCurrentMemo] = useState('');
  const memoPadRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const storedMemos = localStorage.getItem('memos');
    if (storedMemos) {
      try {
        const parsedMemos = JSON.parse(storedMemos);
        setMemos(parsedMemos.map((memo: any) => ({
          ...memo,
          createdAt: new Date(memo.createdAt)
        })));
      } catch (error) {
        console.error('Failed to parse stored memos:', error);
        setMemos([]);
      }
    }
  }, []);

  useEffect(() => {
    if (memos.length > 0) {
      const memosToStore = memos.map(memo => ({
        ...memo,
        createdAt: memo.createdAt.toISOString()
      }));
      localStorage.setItem('memos', JSON.stringify(memosToStore));
    }
  }, [memos]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (memoPadRef.current && !memoPadRef.current.contains(event.target as Node)) {
        onClose();
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onClose]);

  const addMemo = () => {
    if (currentMemo.trim()) {
      const newMemo: Memo = {
        id: Date.now().toString(),
        content: currentMemo.trim(),
        createdAt: new Date(),
      };
      setMemos([newMemo, ...memos]);
      setCurrentMemo('');
    }
  };

  const deleteMemo = (id: string) => {
    const updatedMemos = memos.filter(memo => memo.id !== id);
    setMemos(updatedMemos);
    if (updatedMemos.length === 0) {
      localStorage.removeItem('memos');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div ref={memoPadRef} className="bg-gradient-to-br from-pink-100 to-blue-100 rounded-lg p-6 shadow-lg max-w-md w-full relative">
        <button
          onClick={onClose}
          className="absolute top-2 right-2 bg-pink-300 hover:bg-pink-400 text-white rounded-full p-1 transition-colors duration-200 z-10"
        >
          <X size={20} />
        </button>
        <div className="mb-4">
          <textarea
            value={currentMemo}
            onChange={(e) => setCurrentMemo(e.target.value)}
            className="w-full h-32 p-3 border-2 border-pink-300 rounded-md resize-none focus:outline-none focus:ring-2 focus:ring-pink-400 focus:border-transparent transition-all duration-200 bg-white bg-opacity-70"
            placeholder="新しいメモを入力してください..."
          />
          <Button onClick={addMemo} className="y2k-button w-full text-lg py-3">
            <Plus size={16} className="mr-2" />
          </Button>
        </div>
        <div className="max-h-64 overflow-y-auto space-y-2">
          {memos.map((memo) => (
            <div key={memo.id} className="bg-white bg-opacity-70 p-3 rounded-lg shadow-md transition-all duration-200 hover:shadow-lg">
              <p className="text-sm text-gray-800">{memo.content}</p>
              <div className="flex justify-between items-center mt-2">
                <p className="text-xs text-gray-500">{new Date(memo.createdAt).toLocaleString('ja-JP')}</p>
                <button
                  onClick={() => deleteMemo(memo.id)}
                  className="text-red-400 hover:text-red-600 transition-colors duration-200"
                >
                  <Trash size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
