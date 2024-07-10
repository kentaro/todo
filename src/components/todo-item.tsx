import { useState } from 'react'
import { Todo } from '@/types'
import { Checkbox } from "@/components/ui/checkbox"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

type TodoItemProps = {
  todo: Todo
  onToggle: (id: number) => void
  onDelete: (id: number) => void
  onUpdate: (id: number, newTitle: string, newDueDate?: Date) => void
}

export function TodoItem({ todo, onToggle, onDelete, onUpdate }: TodoItemProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [editTitle, setEditTitle] = useState(todo.title)
  const [editDueDate, setEditDueDate] = useState(todo.dueDate ? new Date(todo.dueDate).toISOString().split('T')[0] : '')
  const [editDueTime, setEditDueTime] = useState(todo.dueDate ? new Date(todo.dueDate).toISOString().split('T')[1].substr(0, 5) : '')

  const formatDate = (date: Date | string) => {
    const dateObj = date instanceof Date ? date : new Date(date)
    return dateObj.toLocaleString('ja-JP', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const handleUpdate = () => {
    const newDueDate = editDueDate && editDueTime
      ? new Date(`${editDueDate}T${editDueTime}`)
      : undefined
    onUpdate(todo.id, editTitle, newDueDate)
    setIsEditing(false)
  }

  if (isEditing) {
    return (
      <div className="flex items-center gap-2 py-2 px-4 mb-2 bg-gradient-to-r from-purple-400 via-pink-400 to-red-400 rounded-lg shadow-md">
        <Input
          value={editTitle}
          onChange={(e) => setEditTitle(e.target.value)}
          className="flex-grow"
        />
        <Input
          type="date"
          value={editDueDate}
          onChange={(e) => setEditDueDate(e.target.value)}
        />
        <Input
          type="time"
          value={editDueTime}
          onChange={(e) => setEditDueTime(e.target.value)}
        />
        <Button onClick={handleUpdate} className="bg-purple-500 hover:bg-purple-600 text-white">
          更新
        </Button>
        <Button onClick={() => setIsEditing(false)} className="bg-pink-500 hover:bg-pink-600 text-white">
          キャンセル
        </Button>
      </div>
    )
  }

  return (
    <div className="flex items-center gap-2 py-2 px-4 mb-2 bg-gradient-to-r from-purple-400 via-pink-400 to-red-400 rounded-lg shadow-md">
      <Checkbox
        checked={todo.completed}
        onCheckedChange={() => onToggle(todo.id)}
        id={`todo-${todo.id}`}
        className="border-2 border-white"
      />
      <div className="flex-grow">
        <label
          htmlFor={`todo-${todo.id}`}
          className={`text-white text-xl ${todo.completed ? 'line-through opacity-50' : ''}`}
        >
          {todo.title}
        </label>
        {todo.dueDate && (
          <p className="text-xs text-white opacity-75">
            期限: {formatDate(todo.dueDate)}
          </p>
        )}
      </div>
      <Button onClick={() => setIsEditing(true)} className="bg-purple-500 hover:bg-purple-600 text-white">
        編集
      </Button>
      <Button variant="destructive" size="sm" onClick={() => onDelete(todo.id)} className="bg-red-500 hover:bg-red-600 text-white">
        削除
      </Button>
    </div>
  )
}
