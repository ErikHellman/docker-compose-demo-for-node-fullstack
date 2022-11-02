import { TodoItem } from "@docker-demo/shared";
import postgres from "postgres";

const url =
  process.env.POSTGRES_URL ||
  "postgres://todoapp:todoapp@localhost:5432/todoapp";
const sql = postgres(url);

export const loadAllTodoItems = async (): Promise<TodoItem[]> => {
  return sql<TodoItem[]>`SELECT * FROM todo ORDER BY created`;
};

export const loadTodoItem = async (
  todoId: string
): Promise<TodoItem | null> => {
  const [first] = await sql<
    TodoItem[]
  >`SELECT * FROM todo WHERE id = ${todoId}`;
  return first || null;
};

export const saveTodoItem = async (todoItem: TodoItem): Promise<void> => {
  await sql`INSERT INTO todo (todo_text, author) VALUES (${todoItem.todo_text}, ${todoItem?.author || "Unknown"})`;
};

export const deleteTodoItem = async (id: string): Promise<void> => {
  await sql`DELETE FROM todo WHERE id = ${id}`;
};

export const updateTodoItem = async (todoItem: TodoItem): Promise<void> => {
  if (todoItem.id) {
    const result =
      await sql`UPDATE todo SET todo_text = ${todoItem.todo_text} WHERE id = ${todoItem.id}`;
  }
};
