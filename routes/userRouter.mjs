import express from 'express';
import usersController from '../controller/usersController.mjs'

const userRouter = express.Router();


userRouter.post('/login', usersController.login);
userRouter.get('/current', usersController.getUser);
userRouter.get('/logout', usersController.logout);

export default userRouter;
