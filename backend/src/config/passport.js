import passport from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';
import { db } from '../../app.js';
import { ObjectId } from 'mongodb';

passport.use(new LocalStrategy(
  async (username, password, done) => {
    const user = await db.collection('users').findOne({ username: username, password: password })
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