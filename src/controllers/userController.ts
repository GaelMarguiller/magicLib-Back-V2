import { IUser, User } from '../models/usersModel';
import { DatabaseError } from './errors/databaseError';
import { UserNotFoundError } from './errors/userNotFound';

export function getUser(
  id: string,
  callback: (user: IUser | null) => void,
): void {
  User.findById(id, (err, res) => {
    if (err) {
      throw new DatabaseError(err);
    }
    callback(res);
  });
}

export function getListUsers(): Promise<IUser[]> {
  return User.find({}, '_id firstname lastname').then((res) => res);
}

export function createUser(
  firstname: string,
  lastname: string,
  email: string,
  password: string,
): IUser {
  const user = new User({ firstname, lastname, email });
  user.setPassword(password);
  user.save();
  return user;
}

export function updateUser(id: string, firstname?: string, lastname?: string, email?: string, callback?: (user: IUser) => void) {
  User.findById(id, (err, user) => {
    if (err) { throw new DatabaseError(err); }
    if (!user) { throw new UserNotFoundError(id, 'User Not Found'); }

    user.firstname = firstname || user.firstname;
    user.lastname = lastname || user.lastname;
    user.email = email || user.email;

    user.save();

    if (callback) callback(user);
  });
}

export function deleteUser(
  id: string,
  callback: (user: IUser | null) => void,
): void {
  User.findByIdAndDelete(id, (err, res) => {
    if (err) {
      throw new DatabaseError(err);
    }
    callback(res);
  });
}
