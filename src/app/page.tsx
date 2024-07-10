'use client'

import { useState, useEffect } from 'react'
import { TodoList } from '@/components/todo-list'
import { AddTodo } from '@/components/add-todo'
import { Todo } from '@/types'

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
    <main className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">TODOアプリ</h1>
      <AddTodo onAdd={addTodo} />
      {!isLoaded ? (
        <div className="text-center mt-4">読み込み中...</div>
      ) : (
        <TodoList todos={todos} onToggle={toggleTodo} onDelete={deleteTodo} />
      )}
    </main>
  )
}
