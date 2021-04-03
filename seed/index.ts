import User from '../src/model/user';
import Book from '../src/model/book';
import UserBook from '../src/model/user_book';

import fakeUser from './user';
import fakeBook from './book';
import DatabaseConnection from '../src/config/DatabaseConnection';
import fakeUserBook from './user-book';

require('dotenv').config();

async function startSeeding(total: number) {
  try {
    await DatabaseConnection.setup();

    const users = await fakeUser(total);
    const books = fakeBook(total);

    await Promise.all([
      User.bulkWrite(users.map((document) => ({ insertOne: { document } }))),
      Book.bulkWrite(books.map((document) => ({ insertOne: { document } }))),
    ]);

    const [userDatas, bookDatas] = await Promise.all([
      User.find({}, {}, { limit: total, sort: '-_id', lean: true }),
      Book.find({}, {}, { limit: total, sort: '-_id', lean: true }),
    ]);

    const userBooks = fakeUserBook(bookDatas, userDatas);
    await UserBook.bulkWrite(userBooks.map((document) => ({ insertOne: { document } })));

    process.exit();
  } catch (e) {
    // eslint-disable-next-line no-console
    console.log(e);
    process.exit(1);
  }
}

startSeeding(parseInt(process.argv[2], 10));
