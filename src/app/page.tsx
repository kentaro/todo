'use client'

import { useState, useEffect } from 'react'
import { TodoList } from '@/components/todo-list'
import { AddTodo } from '@/components/add-todo'
import { Todo } from '@/types'
import { EmptyTodoSVG } from '@/components/empty-todo-svg'

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

  const updateTodo = (id: number, newTitle: string, newDueDate?: Date) => {
    setTodos(
      todos.map((todo) =>
        todo.id === id
          ? { ...todo, title: newTitle, dueDate: newDueDate, notified: false }
          : todo
      )
    )
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
    <div className="flex flex-col min-h-screen bg-background text-foreground">
      <header className="bg-primary p-6 shadow-md">
        <div className="container mx-auto flex items-center justify-center">
          <h1 className="text-6xl font-bold text-white bg-gradient-to-r from-pink-500 to-cyan-500 bg-clip-text text-transparent">
            TODO
          </h1>
        </div>
      </header>
      <main className="flex-grow overflow-y-auto p-4">
        <div className="container mx-auto max-w-2xl">
          {!isLoaded ? (
            <div className="text-center mt-4 text-secondary">読み込み中...</div>
          ) : todos.length > 0 ? (
            <TodoList todos={todos} onToggle={toggleTodo} onDelete={deleteTodo} onUpdate={updateTodo} />
          ) : (
            <div className="flex flex-col items-center justify-center h-full mt-20">
              <div className="text-4xl font-bold text-accent mb-4">✨</div>
              <p className="text-2xl font-bold text-accent mb-2">タスクがありません</p>
              <p className="text-lg text-secondary">新しいタスクを追加して始めましょう！</p>
            </div>
          )}
        </div>
      </main>
      <footer className="bg-[var(--footer-bg)] p-4">
        <div className="container mx-auto max-w-2xl">
          <AddTodo onAdd={addTodo} />
        </div>
      </footer>
    </div>
  )
}
