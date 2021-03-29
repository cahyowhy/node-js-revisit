import jwt from 'jsonwebtoken';
import randToken from 'rand-token';
import { IUser } from '../model/user';

// import passport from "passport";
// import bcrypt from "bcrypt";
// import passportJwt from "passport-jwt";
// import passportLocal from "passport-local";
// import User from '../model/user';

// passport.use(new passportLocal.Strategy(async (username: string, password: string, done) => {
//   try {
//     const user = await User.findOne({ username, password }).exec();

//     if (!user) {
//       done(new Error('User not found'));
//     }

//     const valid = await bcrypt.compare(password, (user?.password || ''));

//     if (valid) {
//       done(null, user);
//     } else {
//       done(new Error('Password not valid'));
//     }
//   } catch (e) {
//     console.log(e);

//     done(e);
//   }
// }));

// passport.use(new passportJwt.Strategy({
//   secretOrKey: (process.env.JWT_SECRET as string),
//   jwtFromRequest: req => req.cookies.jwt,
// }, (jwtPayload, done) => {
//   if (Date.now() > jwtPayload.expires) {
//     return done('jwt expired');
//   }

//   return done(null, jwtPayload);
// }));

export function generateAccessToken(user: IUser) {
  return jwt.sign(user, (process.env.JWT_SECRET as string), { expiresIn: '30m' });
}

export function generateRefreshToken() {
  return randToken.uid(256);
}
