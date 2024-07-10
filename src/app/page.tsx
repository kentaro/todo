'use client'

import { useState, useEffect } from 'react'
import { TodoList } from '@/components/todo-list'
import { AddTodo } from '@/components/add-todo'
import { Todo } from '@/types'
import { EmptyTodoSVG } from '@/components/empty-todo-svg'
import Y2KLogo from '@/components/y2k-logo'

export default function Home() {
  const [todos, setTodos] = useState<Todo[]>([])
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    const storedTodos = localStorage.getItem('todos')
    if (storedTodos) {
      setTodos(JSON.parse(storedTodos))
    }
    setIsLoaded(true)

    // 通知の許可を要求
    if ('Notification' in window) {
      Notification.requestPermission();
    }

    // サービスワーカーの登録
    if ('serviceWorker' in navigator) {
      window.addEventListener('load', function() {
        navigator.serviceWorker.register('/todo/sw.js').then(
          function(registration) {
            console.log('Service Worker registration successful with scope: ', registration.scope);
          },
          function(err) {
            console.log('Service Worker registration failed: ', err);
          }
        );
      });
    }
  }, [])

  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem('todos', JSON.stringify(todos))
    }

    // タスクの期限をチェック
    const checkDeadlines = () => {
      const now = new Date();
      todos.forEach((todo) => {
        if (todo.dueDate && new Date(todo.dueDate) <= now && !todo.notified) {
          sendNotification(todo);
          setTodos((prevTodos) =>
            prevTodos.map((t) =>
              t.id === todo.id ? { ...t, notified: true } : t
            )
          );
        }
      });
    };

    const intervalId = setInterval(checkDeadlines, 60000); // 1分ごとにチェック

    return () => clearInterval(intervalId);
  }, [todos, isLoaded])

  const addTodo = (title: string, dueDate?: Date) => {
    const newTodo: Todo = {
      id: Date.now(),
      title,
      completed: false,
      dueDate,
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

  const sendNotification = (todo: Todo) => {
    if ('Notification' in window && Notification.permission === 'granted') {
      navigator.serviceWorker.ready.then((registration) => {
        registration.showNotification('TODOの期限通知', {
          body: `「${todo.title}」の期限が来ました。`,
          icon: '/todo/icon-192x192.png',
          badge: '/todo/icon-192x192.png'
        });
      });
    }
  };

  return (
    <main className="container mx-auto bg-gradient-to-b from-cyan-200 via-pink-200 to-yellow-200 min-h-screen flex flex-col">
      <header className="fixed top-0 left-0 right-0 bg-gradient-to-r from-purple-400 via-pink-400 to-red-400 z-10">
        <div className="container mx-auto p-4 flex justify-center">
          <Y2KLogo />
        </div>
      </header>
      <div className="flex-grow overflow-y-auto pt-24 pb-24 px-4">
        {!isLoaded ? (
          <div className="text-center mt-4 text-purple-800">読み込み中...</div>
        ) : todos.length > 0 ? (
          <TodoList todos={todos} onToggle={toggleTodo} onDelete={deleteTodo} />
        ) : (
          <div className="flex flex-col items-center justify-center h-full">
            <EmptyTodoSVG />
            <p className="mt-4 text-lg text-purple-800">タスクがありません。新しいタスクを追加してください。</p>
          </div>
        )}
      </div>
      <div className="fixed bottom-0 left-0 right-0 bg-blue-300 z-10">
        <AddTodo onAdd={addTodo} />
      </div>
    </main>
  )
}
