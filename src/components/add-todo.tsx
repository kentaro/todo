'use client'

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

type AddTodoProps = {
  onAdd: (title: string) => void
}

export function AddTodo({ onAdd }: AddTodoProps) {
  const [title, setTitle] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (title.trim()) {
      onAdd(title.trim())
      setTitle('')
    }
  }

  return (
    <form onSubmit={handleSubmit} className="fixed bottom-0 left-0 right-0 bg-blue-300 p-4 shadow-lg">
      <div className="container mx-auto flex gap-2">
        <Input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="新しいタスクを入力"
          className="flex-grow"
        />
        <Button type="submit">追加</Button>
      </div>
    </form>
  )
}
