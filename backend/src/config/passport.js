import passport from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';
import { db } from '../../app.js';
import { ObjectId } from 'mongodb';
import bcrypt from 'bcrypt';

passport.use(new LocalStrategy(
  async (username, password, done) => {
    const codedPassword = await bcrypt.hash(password, 10);
    const user = await db.collection('users').findOne({ username: username })
    if (!user) {
      return done(null, false, { message: 'No existe ninguna cuenta con este nombre de usuario' });
    }
    if (!await bcrypt.compare(password, user.password)) {
      return done(null, false, { message: 'Contraseña incorrecta' });
    }
    return done(null, user);
  }
));

passport.serializeUser(function(user, done) {
  done(null, user._id);
});
  
passport.deserializeUser(async function (id, done) {
  const user = await db.collection('users').findOne({ _id: ObjectId.createFromHexString(id) });
  done(null, user);
});
  
export default passport;