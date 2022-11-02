import cors from "cors";
import express, { Application, json, Request, Response } from "express";
import dotenv from "dotenv";
import todosController from "./todos-controller";
import { setupMongoDb } from "./common";
import cookieParser from "cookie-parser";
import loginController, { JWT_COOKIE_NAME } from "./login-controller";
import jsonwebtoken from "jsonwebtoken";

dotenv.config();

const app: Application = express();
app.use(cookieParser());
app.use(cors({
  origin: ["http://localhost:3000"],
  credentials: true
}));
app.use(json());

const port: number = parseInt(process.env.SERVER_PORT || "4000");
const mongoUrl: string =
  process.env.MONGODB_URL || "mongodb://localhost:27017/mytodos";

app.use("/todos", (request: Request, response: Response, next) => {
  const token = request.cookies[JWT_COOKIE_NAME]
  console.log('Got cookie:', token)
  if (token) {
    const decoded = jsonwebtoken.decode(token)
    console.log('Decoded token:', decoded);
    next()
  } else {
    response.sendStatus(403)
  }
});

app.use("/todos", todosController);
app.use("/login", loginController)

app.listen(port, async function () {
  // await setupMongoDb(mongoUrl);
  console.log(`App is listening on port ${port}!`);
});
