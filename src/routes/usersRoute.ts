import { Request, Response, Router } from 'express';
import {
  createUser,
  deleteUser,
  getListUsers,
  getUser,
  updateUser,
} from '../controllers/userController';
import { IUser } from '../models/usersModel';
import authenticationRequired from '../middlewares/authenticationRequired';

const router = Router();

router.get('/', (req: Request, res: Response) => {
  getListUsers().then((users: IUser[]) => res.send(
    users.map((user: IUser) => user.getSafeUser()),
  ));
});

router.post('/', (req : Request, res : Response) => {
  const {
    firstname, lastname, email, password,
  } = req.body;

  if (!firstname || !lastname || !email || !password) {
    return res.status(400).send('Please provide a firstname, lastname and email');
  }
  const newUser = createUser(firstname, lastname, email, password);

  return res.send(newUser.getSafeUser());
});

router.get('/:userId', (req: Request, res: Response) => {
  const id: string = req.params.userId;

  getUser(id, (user) => {
    if (!user) return res.status(404).send('User not found');
    return res.send((req.user as IUser).getSafeUser());
  });
});

router.patch('/:userId', authenticationRequired, (req: Request, res: Response) => {
  const id = req.params.userId;
  const { firstname, lastname, email } = req.body;

  updateUser(
    id,
    firstname,
    lastname,
    email,
      (user) => {
        if (!id) return res.status(404).send('User not found');
        return res.send(user);
      },
  );
});

router.delete('/:userId', (req, res) => {
  const id: string = req.params.userId;

  deleteUser(id, (user) => {
    if (!id) return res.status(404).send('User not found');
    return res.send(user);
  });
});
export default router;
