import { Users, login, register } from '../controllers/user.controller';
import express from 'express';

const userRouter = express.Router();
userRouter.post("/auth/register", register);
userRouter.post("/auth/login", login);
userRouter.get("/users", Users);

export default userRouter;