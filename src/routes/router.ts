import { Router } from 'express';
import usersRoutes from './usersRoute';
import loginRoutes  from './loginRoute';

const router = Router();

router.use('/users', usersRoutes);
router.use('/login', loginRoutes);

export default router;
