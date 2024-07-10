import { useState } from 'react'
import { Todo } from '@/types'
import { Checkbox } from "@/components/ui/checkbox"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Edit, Trash, Check, X } from "lucide-react"

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
      <div className="y2k-card flex flex-col gap-2 p-4 mb-4">
        <Input
          value={editTitle}
          onChange={(e) => setEditTitle(e.target.value)}
          className="y2k-input"
        />
        <div className="flex flex-col sm:flex-row gap-2">
          <Input
            type="date"
            value={editDueDate}
            onChange={(e) => setEditDueDate(e.target.value)}
            className="y2k-input flex-grow"
          />
          <Input
            type="time"
            value={editDueTime}
            onChange={(e) => setEditDueTime(e.target.value)}
            className="y2k-input flex-grow"
          />
        </div>
        <div className="flex gap-2">
          <Button onClick={handleUpdate} className="y2k-button flex-grow">
            <Check className="w-5 h-5" />
          </Button>
          <Button onClick={() => setIsEditing(false)} className="y2k-button flex-grow">
            <X className="w-5 h-5" />
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="y2k-card flex flex-col sm:flex-row items-start sm:items-center gap-4 p-4 todo-item">
      <div className="flex items-center gap-4 w-full">
        <Checkbox
          checked={todo.completed}
          onCheckedChange={() => onToggle(todo.id)}
          id={`todo-${todo.id}`}
          className="border-2 border-primary w-6 h-6"
        />
        <div className="flex-grow overflow-hidden">
          <p className="text-lg font-semibold mb-1 overflow-hidden text-ellipsis break-words">
            {todo.title}
          </p>
          {todo.dueDate && (
            <p className="text-sm text-gray-500">
              期限: {formatDate(todo.dueDate)}
            </p>
          )}
        </div>
      </div>
      <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto mt-2 sm:mt-0">
        <Button onClick={() => setIsEditing(true)} className="y2k-button w-full sm:w-auto">
          <Edit className="w-5 h-5" />
        </Button>
        <Button onClick={() => onDelete(todo.id)} className="y2k-button bg-red-500 hover:bg-red-600 w-full sm:w-auto">
          <Trash className="w-5 h-5" />
        </Button>
      </div>
    </div>
  )
}
