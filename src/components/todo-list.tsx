import { Todo } from '@/types'
import { TodoItem } from './todo-item'
import { useEffect, useState } from 'react'

type TodoListProps = {
  todos: Todo[]
  onToggle: (id: number) => void
  onDelete: (id: number) => void
  onUpdate: (id: number, newTitle: string, newDueDate?: Date) => void
}

export function TodoList({ todos, onToggle, onDelete, onUpdate }: TodoListProps) {
  const [animatedTodoId, setAnimatedTodoId] = useState<number | null>(null);

  useEffect(() => {
    if (todos.length > 0) {
      const latestTodo = todos[0];
      setAnimatedTodoId(latestTodo.id);
      const timer = setTimeout(() => setAnimatedTodoId(null), 1000);
      return () => clearTimeout(timer);
    }
  }, [todos]);

  const sortedTodos = [...todos].sort((a, b) => {
    if (a.completed !== b.completed) {
      return a.completed ? 1 : -1;
    }
    if (!a.completed && !b.completed) {
      if (a.dueDate && b.dueDate) {
        return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
      }
      return a.dueDate ? -1 : 1;
    }
    return b.id - a.id;
  });

  return (
    <div className="space-y-2 pb-4">
      {sortedTodos.map((todo) => (
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
