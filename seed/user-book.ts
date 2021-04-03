import { IUser } from '../src/model/user';
import { IBook } from '../src/model/book';

export default (books: IBook[], users: IUser[]) => users.map((user) => {
  const {
    email,
    firstName,
    lastName,
    _id: id,
  } = user;

  const paramUser = {
    email,
    firstName,
    lastName,
    id,
  };

  return {
    user: paramUser,
    books: books.slice(0, 5).map(({ title, _id }) => ({ title, id: _id, borrowDate: new Date() })),
  };
});
