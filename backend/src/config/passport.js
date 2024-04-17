import passport from 'passport';
import bcrypt from 'bcrypt';
import { Strategy as LocalStrategy } from 'passport-local';
import { ObjectId } from 'mongodb';
import { db, mongooseMode } from '../../app.js';
import User from '../models/userSchema.js';

passport.use(new LocalStrategy(
  async (username, password, done) => {

    let user; 
    if (mongooseMode) {
      user = await User.findOne({ username: username });
    } else {
      user = await db.collection('users').findOne({ username: username })
    }
    
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

  let user;
  if (mongooseMode) {
    user = await User.findById(id);
  } else{
    user = await db.collection('users').findOne({ _id: ObjectId.createFromHexString(id) });
  }
  done(null, user);
  
});
  
export default passport;