import express, { Router, Request, Response, response } from "express";
import jsonwebtoken from "jsonwebtoken";

const secret: string =
  process.env.TOKEN_SECRET ||
  "f9daa8f6d9ec89bd339e1fa53ae744d98e8170d822f2f014ed0a5f49d392059ee1210953f28e1a535e0980c73750cb077b95c8fa3a676bbf2907e86f8dc8b741";
export const JWT_COOKIE_NAME = "jwt";

const loginController = express.Router();

loginController.post("/", (request: Request, response: Response) => {
  const token = jsonwebtoken.sign(
    {
      sub: "erik.hellman@iteam.se",
      name: "Erik Hellman",
    },
    secret,
    { expiresIn: "1h" }
  );
  
  const expires = new Date(Date.now() + 120000)

  response.cookie(JWT_COOKIE_NAME, token, { expires: new Date(Date.now() + 900000), httpOnly: true })
  response.sendStatus(200)
});

export default loginController;
