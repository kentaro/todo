import { Todo } from '@/types'
import { TodoItem } from './todo-item'

type TodoListProps = {
  todos: Todo[]
  onToggle: (id: number) => void
  onDelete: (id: number) => void
  onUpdate: (id: number, newTitle: string, newDueDate?: Date) => void
}

export function TodoList({ todos, onToggle, onDelete, onUpdate }: TodoListProps) {
  return (
    <div>
      {todos.map((todo) => (
        <TodoItem
          key={todo.id}
          todo={todo}
          onToggle={onToggle}
          onDelete={onDelete}
          onUpdate={onUpdate}
        />
      ))}
    </div>
  )
}
