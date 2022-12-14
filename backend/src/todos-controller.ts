import { TodoItem } from "@docker-demo/shared";
import express, { Router, Request, Response } from "express";
import {
  deleteTodoItem,
  loadAllTodoItems,
  loadTodoItem,
  saveTodoItem,
} from "./todos-repository";

const todosController = express.Router();

todosController.get("/", async (req: Request, res: Response<TodoItem[]>) => {
  res.send(await loadAllTodoItems());
});

todosController.get(
  "/:todoId",
  async (req: Request, res: Response<TodoItem>) => {
    const item = await loadTodoItem(req.params.todoId);
    if (item) {
      res.send(item);
    } else {
      res.sendStatus(404);
    }
  }
);

todosController.post(
  "/",
  async (req: Request<TodoItem>, res: Response<TodoItem[]>) => {
    try {
      const item = req.body;
      item.timeStamp = new Date();
      await saveTodoItem(item);
      res.send(await loadAllTodoItems());
    } catch (e) {
      res.sendStatus(400);
    }
  }
);

todosController.delete(
  "/:todoId",
  async (req: Request, res: Response<TodoItem[]>) => {
    await deleteTodoItem(req.params.todoId);
    res.send(await loadAllTodoItems());
  }
);

export default todosController;
