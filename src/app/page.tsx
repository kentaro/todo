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
  }, [])

  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem('todos', JSON.stringify(todos))
    }
  }, [todos, isLoaded])

  const addTodo = (title: string) => {
    const newTodo: Todo = {
      id: Date.now(),
      title,
      completed: false,
    }
    setTodos([...todos, newTodo])
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

  return (
    <main className="container mx-auto p-4 bg-gradient-to-b from-cyan-200 to-blue-300 min-h-screen flex flex-col">
      <div className="flex-grow overflow-y-auto pb-16">
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
      <AddTodo onAdd={addTodo} />
    </main>
  )
}
