import { Todo } from '@/types'
import { Checkbox } from "@/components/ui/checkbox"
import { Button } from "@/components/ui/button"

type TodoItemProps = {
  todo: Todo
  onToggle: (id: number) => void
  onDelete: (id: number) => void
}

export function TodoItem({ todo, onToggle, onDelete }: TodoItemProps) {
  return (
    <div className="flex items-center gap-2 py-2">
      <Checkbox
        checked={todo.completed}
        onCheckedChange={() => onToggle(todo.id)}
        id={`todo-${todo.id}`}
      />
      <label
        htmlFor={`todo-${todo.id}`}
        className={`flex-grow ${todo.completed ? 'line-through text-gray-500' : ''}`}
      >
        {todo.title}
      </label>
      <Button variant="destructive" size="sm" onClick={() => onDelete(todo.id)}>
        削除
      </Button>
    </div>
  )
}
