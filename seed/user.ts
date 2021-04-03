import { internet, name, phone } from 'faker';
import bcrypt from 'bcrypt';

export default async (total = 10) => {
  const promisePassword = new Array(total).fill(null).map(() => new Promise((resolve, reject) => {
    bcrypt.genSalt(10)
      .then((salt) => {
        bcrypt.hash('12345678', salt)
          .then((password) => resolve(password))
          .catch(reject);
      })
      .catch(reject);
  }));

  const passwords = await Promise.all(promisePassword);

  return passwords.map((password) => {
    const firstName = name.firstName();
    const lastName = name.lastName();
    const email = internet.email(firstName, lastName);
    const username = internet.userName(firstName, lastName);

    return {
      email,
      firstName,
      lastName,
      username,
      password,
      phoneNumber: phone.phoneNumber(),
      birthDate: new Date(),
      type: 'USER',
    };
  });
};
