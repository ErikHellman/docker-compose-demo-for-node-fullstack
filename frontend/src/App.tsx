import React, { useEffect, useState } from "react";
import "./App.css";
import { TodoItem } from "@docker-demo/shared";
import axios from "axios";

const baseURL = process.env.REACT_APP_TODO_API || "http://localhost:4000";
console.info(`Setting base URL for API to ${baseURL}`);
axios.defaults.baseURL = baseURL;

const getTodos = async (): Promise<TodoItem[]> => {
  const response = await axios.get<TodoItem[]>("/todos");
  return response.data;
};

const postTodo = async (item: TodoItem): Promise<TodoItem[]> => {
  const response = await axios.post<TodoItem[]>("/todos", item, {
    withCredentials: true,
  });
  return response.data;
};

const deleteTodo = async (item: TodoItem): Promise<TodoItem[]> => {
  const response = await axios.delete<TodoItem[]>(`/todos/${item.id}`, {
    withCredentials: true,
  });
  return response.data;
};

function App() {
  const [todoText, setTodoText] = useState<string>("");
  const [todos, setTodos] = useState<TodoItem[]>([]);

  useEffect(() => {
    getTodos().then(setTodos).catch(console.error);
  }, []);

  const removeTodo = async (item: TodoItem) => {
    await deleteTodo(item);
    setTodos(await getTodos());
  };

  const addTodo = async (text: string) => {
    setTodoText("");
    const latest = await postTodo({
      todo_text: text,
    });
    setTodos(latest);
  };

  const doLogin = () => {
    axios.post("/login", {}, { withCredentials: true });
  };

  return (
    <article className="App">
      <header className="App-header"><span onClick={doLogin}>My Todos</span></header>
      <main className="App-content">
        <ul>
          {todos.map((item) => (
            <li key={item.id}>
              {item.todo_text} - {item.author || "Unknonw"} - {" "}
              <span onClick={() => removeTodo(item)}>Delete?</span>
            </li>
          ))}
        </ul>
      </main>
      <footer className="App-footer">
        <input
          type="text"
          placeholder="Enter new todo.."
          value={todoText}
          onChange={(e) => setTodoText(e.target.value)}
        />
        <button
          onClick={() => {
            addTodo(todoText);
          }}
        >
          Add
        </button>
      </footer>
    </article>
  );
}

export default App;
