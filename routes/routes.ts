import { getUsers, getUser, getUserLogin, authMiddleware } from './../controllers/usersController.ts';
import { Router } from "https://deno.land/x/oak/mod.ts";

const router = new Router({
    prefix: '/api/v1'
})
router.get('/users', authMiddleware, getUsers)
    .get('/user/:id', authMiddleware, getUser)
    .post('/user/login', getUserLogin)
export default router;