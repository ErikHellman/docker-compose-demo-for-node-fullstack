import React, { useEffect, useState } from "react";
import "./App.css";
import { TodoItem } from "@docker-demo/shared";

// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {
  getFirestore,
  CollectionReference,
  collection,
  DocumentData,
  onSnapshot,
  doc,
  addDoc,
  deleteDoc,
  query
} from "firebase/firestore";
import { queryAllByAltText } from "@testing-library/react";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyD2XkdllSRVPUN-RMQSS5lxwYvIlxDmE9Y",
  authDomain: "backend3-typescript-demo.firebaseapp.com",
  projectId: "backend3-typescript-demo",
  storageBucket: "backend3-typescript-demo.appspot.com",
  messagingSenderId: "671582057941",
  appId: "1:671582057941:web:f3b0005c8439a5499f395c",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const firestore = getFirestore();

const createCollection = <T = DocumentData>(collectionName: string) => {
  return collection(firestore, collectionName) as CollectionReference<T>;
};

const todosCollection = createCollection<TodoItem>("todos");

function App() {
  const [todoText, setTodoText] = useState<string>("");
  const [todos, setTodos] = useState<TodoItem[]>([]);

  useEffect(() => {
    const q = query(todosCollection)
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const latest: TodoItem[] = []
      querySnapshot.forEach((doc) => {
        latest.push(doc.data())
      })
      setTodos(latest)
    })
    return unsubscribe;
  }, []);

  const addTodo = async (text: string) => {
    setTodoText("");
    addDoc(todosCollection, {
      text: text,
      timeStamp: new Date()
    })
  };

  return (
    <article className="App">
      <header className="App-header">My Todos</header>
      <main className="App-content">
        <ul>
          {todos.map((item) => (
            <li key={item.id}>
              {item.text}            
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
