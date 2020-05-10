const { getUsers, getUserById, createUser, updateUser, deleteUser } = require('../controllers/userController');
const { Router } = require('express');
const userRouter = Router();

userRouter.get('/users', getUsers);
userRouter.get('/users/:id', getUserById);
userRouter.post('/users', createUser);
userRouter.put('/users/:id', updateUser)
userRouter.delete('/users/:id', deleteUser);

module.exports = userRouter;