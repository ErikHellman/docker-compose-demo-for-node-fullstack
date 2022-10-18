import React, { useEffect, useReducer, useState } from "react";
import "./App.css";
import { TodoItem } from "@docker-demo/shared";
import axios from "axios";

axios.defaults.baseURL =
  process.env.REACT_APP_TODO_API || "http://localhost:4000";

const getTodos = async (): Promise<TodoItem[]> => {
  const response = await axios.get<TodoItem[]>("/todos");
  return response.data;
};

const postTodo = async (item: TodoItem): Promise<TodoItem> => {
  const response = await axios.post<TodoItem>("/todos", item);
  return response.data;
};

const deleteTodo = async (item: TodoItem): Promise<TodoItem | null> => {
  const response = await axios.delete<TodoItem>(`/todos/${item._id}`);
  if (response.status === 200) {
    return response.data;
  } else {
    return null
  }
};

type TodoAction = {
  type: "add" | "remove" | "replaceAll";
  data: TodoItem | TodoItem[];
};

const todosReducer = (state: TodoItem[], action: TodoAction) => {
  switch (action.type) {
    case "add":
      return [...state, action.data as TodoItem];
    case "remove":
      return state.filter((item) => {
        const todo = action.data as TodoItem;
        return item._id !== todo._id;
      });
    case "replaceAll":
      return action.data as TodoItem[]
    default:
      throw new Error();
  }
};

function App() {
  const [todoText, setTodoText] = useState<string>("");
  const [todos, dispatch] = useReducer(todosReducer, []);
  // const [todos, setTodos] = useState<TodoItem[]>([]);

  useEffect(() => {
    getTodos()
      .then((todos) => {
        dispatch({
          type: "replaceAll",
          data: todos
        })
      })
      .catch(console.error);
  }, []);

  const removeTodo = async (item: TodoItem) => {
    const deleted = await deleteTodo(item);
    if (deleted) {
      dispatch({
        type: "remove",
        data: item
      })
    }
  };

  const addTodo = async (text: string) => {
    setTodoText("");
    const added = await postTodo({
      text,
      timeStamp: new Date(),
    });
    dispatch({
      type: "add",
      data: added
    })
  };

  return (
    <article className="App">
      <header className="App-header">My Todos</header>
      <main className="App-content">
        <ul>
          {todos.map((item) => (
            <li key={item._id}>
              {item.text} -{" "}
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
