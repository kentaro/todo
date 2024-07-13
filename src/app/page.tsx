'use client'

import { useState, useEffect } from 'react'
import { TodoList } from '@/components/todo-list'
import { AddTodo } from '@/components/add-todo'
import { Todo } from '@/types'
import Y2KLogo from '@/components/y2k-logo'
import { SpeechToggle } from '@/components/speech-toggle'
import { PomodoroTimer } from '@/components/pomodoro-timer'
import Image from 'next/image'
import { Timer } from 'lucide-react'

function canUseNotifications() {
  return 'Notification' in window && 'serviceWorker' in navigator && 'PushManager' in window;
}

function canUseSpeechSynthesis() {
  return 'speechSynthesis' in window && 'SpeechSynthesisUtterance' in window;
}

export default function Home() {
  const [todos, setTodos] = useState<Todo[]>([])
  const [isLoaded, setIsLoaded] = useState(false)
  const [isSpeechEnabled, setIsSpeechEnabled] = useState(false)
  const [isPomodoroOpen, setIsPomodoroOpen] = useState(false)
  const [isTimerActive, setIsTimerActive] = useState(false)

  useEffect(() => {
    const storedTodos = localStorage.getItem('todos')
    const storedSpeechEnabled = localStorage.getItem('speechEnabled')
    if (storedTodos) {
      setTodos(JSON.parse(storedTodos))
    }
    if (storedSpeechEnabled) {
      setIsSpeechEnabled(JSON.parse(storedSpeechEnabled))
    }
    setIsLoaded(true)

    if (canUseNotifications()) {
      Notification.requestPermission().then((permission) => {
        if (permission === 'granted') {
          console.log('通知が許可されました');
        } else {
          console.log('通知が許可されませんでした');
        }
      });

      window.addEventListener('load', function() {
        navigator.serviceWorker.register('/sw.js').then(
          function(registration) {
            console.log('Service Worker registration successful with scope: ', registration.scope);
          },
          function(err) {
            console.log('Service Worker registration failed: ', err);
          }
        );
      });
    } else {
      console.log('このブラウザでは通知機能がサポートされていません');
    }

    if (canUseSpeechSynthesis()) {
      console.log('音声合成が利用可能です');
    } else {
      console.log('音声合成が利用できません');
    }
  }, [])

  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem('todos', JSON.stringify(todos))
    }

    const checkDeadlines = () => {
      const now = new Date();
      todos.forEach((todo) => {
        if (todo.dueDate && !todo.completed) {
          const dueDate = new Date(todo.dueDate);
          const timeDiff = dueDate.getTime() - now.getTime();
          const minutesDiff = Math.floor(timeDiff / (1000 * 60));
          if (minutesDiff <= 10 && minutesDiff > 0 && !todo.notified) {
            sendNotification(todo, minutesDiff);
            speakNotification(todo, minutesDiff);
            setTodos((prevTodos) =>
              prevTodos.map((t) =>
                t.id === todo.id ? { ...t, notified: true } : t
              )
            );
          }
        }
      });
    };

    const intervalId = setInterval(checkDeadlines, 10000); // 10秒ごとにチェック

    return () => clearInterval(intervalId);
  }, [todos, isLoaded])

  const addTodo = (title: string, dueDate?: Date) => {
    let adjustedDueDate = dueDate;
    if (dueDate) {
      adjustedDueDate = new Date(dueDate);
      if (adjustedDueDate.getHours() === 0 && adjustedDueDate.getMinutes() === 0) {
        adjustedDueDate.setHours(23, 59, 59, 999);
      }
    }
    const newTodo: Todo = {
      id: Date.now(),
      title,
      completed: false,
      dueDate: adjustedDueDate,
      notified: false,
    }
    setTodos([newTodo, ...todos])
  }

  const toggleTodo = (id: number) => {
    setTodos(
      todos.map((todo) =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      )
    )
  }

  const deleteTodo = (id: number) => {
    setTodos(todos.filter((todo) => todo.id !== id))
  }

  const updateTodo = (id: number, newTitle: string, newDueDate?: Date) => {
    setTodos(
      todos.map((todo) =>
        todo.id === id
          ? { ...todo, title: newTitle, dueDate: newDueDate, notified: false }
          : todo
      )
    )
  }

  const sendNotification = (todo: Todo, minutesLeft: number) => {
    if (canUseNotifications() && Notification.permission === 'granted') {
      navigator.serviceWorker.ready.then((registration) => {
        registration.showNotification('TODOの期限通知', {
          body: `タスク「${todo.title}」の期限まであと${minutesLeft}分です。`,
          icon: '/icon-192x192.png',
          badge: '/icon-192x192.png'
        });
      });
    } else {
      console.log('通知を送信できません：', todo.title);
    }
  };

  const speakNotification = (todo: Todo, minutesLeft: number) => {
    if (isSpeechEnabled && canUseSpeechSynthesis()) {
      const utterance = new SpeechSynthesisUtterance(
        `タスク「${todo.title}」の期限まであと${minutesLeft}分です。`
      );
      utterance.lang = 'ja-JP';
      utterance.volume = 1;
      utterance.rate = 1;
      utterance.pitch = 1;
      window.speechSynthesis.speak(utterance);
    }
  };

  return (
    <div className="flex flex-col h-screen bg-background text-foreground">
      <header className="bg-gradient-to-r from-pink-400 via-purple-400 to-cyan-400 p-4 shadow-md header-sparkle">
        <div className="container mx-auto flex items-center justify-center">
          <div className="flex-grow flex">
            <Y2KLogo className="text-3xl sm:text-5xl" />
            <Image src="/icon-512x512.png" alt="App Icon" width={40} height={40} className="ml-2" />
          </div>
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setIsPomodoroOpen(true)}
              className={`flex items-center justify-center w-10 h-10 bg-white bg-opacity-20 rounded-full shadow-md transition-colors duration-200 ${
                isTimerActive ? 'text-accent' : 'text-white'
              }`}
            >
              <Timer size={20} />
            </button>
            <SpeechToggle
              isEnabled={isSpeechEnabled}
              onToggle={(enabled) => {
                setIsSpeechEnabled(enabled);
                localStorage.setItem('speechEnabled', JSON.stringify(enabled));
              }}
            />
          </div>
        </div>
      </header>
      <main className="flex-grow overflow-hidden flex flex-col">
        <div className="container mx-auto max-w-2xl flex-grow flex flex-col px-4 py-4 overflow-hidden">
          {!isLoaded ? (
            <div className="text-center mt-4 text-secondary">読み込み中...</div>
          ) : todos.length > 0 ? (
            <div className="overflow-y-auto flex-grow">
              <TodoList todos={todos} onToggle={toggleTodo} onDelete={deleteTodo} onUpdate={updateTodo} />
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-full">
            <div className="text-4xl font-bold text-accent mb-4">✨</div>
            <p className="text-2xl font-bold text-accent mb-2">タスクがありません</p>
            <p className="text-lg text-secondary">新しいタスクを追加して始めまし���う！</p>
          </div>
          )}
        </div>
        <PomodoroTimer
          isOpen={isPomodoroOpen}
          onClose={() => setIsPomodoroOpen(false)}
          onTimerStateChange={setIsTimerActive}
        />
      </main>
      <footer className="bg-[var(--footer-bg)] py-6">
        <div className="container mx-auto max-w-2xl px-4">
          <AddTodo onAdd={addTodo} />
        </div>
      </footer>
    </div>
  )
}
