import passport from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';
import { db } from '../../app.js';

passport.use(new LocalStrategy(
    async (username, password, done) => {
      const user = await db.collection('users').findOne({ username: username, password: password })
        return done(null, user);
      }
  ));

passport.serializeUser(function(user, done) {
    done(null, user._id);
});
  
passport.deserializeUser(function(id, done) {
    collection('users').findOne({ _id: id }, function (err, user) {
      done(err, user);
    });
});
  
export default passport;